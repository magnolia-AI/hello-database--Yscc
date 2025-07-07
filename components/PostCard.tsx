'use client';

import { Post, User, Comment, Like } from '@prisma/client';
import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, MessageCircle } from 'lucide-react';
import { toggleLike, createComment } from '@/app/actions/posts';
import { useState, useRef, useActionState } from 'react';

interface PostCardProps {
  post: Post & {
    author: User;
    comments: (Comment & { author: User })[];
    likes: Like[];
  };
  currentUserId: string; // Assuming we have a way to get the current user's ID
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.likes.some(like => like.userId === currentUserId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const commentFormRef = useRef<HTMLFormElement>(null);

  const [commentState, commentAction, isCommentPending] = useActionState(createComment, null);

  const handleToggleLike = async () => {
    const formData = new FormData();
    formData.append('userId', currentUserId);
    formData.append('postId', post.id);

    const result = await toggleLike(formData);
    if (result.success) {
      setIsLiked(result.liked);
      setLikesCount(prev => (result.liked ? prev + 1 : prev - 1));
    } else {
      alert(result.error);
    }
  };

  const handleCommentSubmit = async (formData: FormData) => {
    formData.append('authorId', currentUserId);
    formData.append('postId', post.id);
    await commentAction(formData);
    if (commentState?.success) {
      commentFormRef.current?.reset();
      setShowComments(true); // Ensure comments are visible after posting
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center mb-2">
        <div className="font-semibold text-gray-800">{post.author.name || 'Anonymous'}</div>
        <div className="text-gray-500 text-sm ml-2">{formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}</div>
      </div>
      <p className="text-gray-700 mb-4">{post.content}</p>

      <div className="flex items-center text-gray-600 text-sm mb-4">
        <button onClick={handleToggleLike} className="flex items-center mr-4 focus:outline-none">
          <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
          <span className="ml-1">{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
        </button>
        <button onClick={() => setShowComments(!showComments)} className="flex items-center focus:outline-none">
          <MessageCircle className="w-5 h-5 text-gray-400" />
          <span className="ml-1">{post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {showComments && (
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h4 className="font-semibold mb-2">Comments</h4>
          {post.comments.length === 0 ? (
            <p className="text-gray-500 text-sm">No comments yet. Be the first to comment!</p>
          ) : (
            <div className="space-y-3">
              {post.comments.map(comment => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center mb-1">
                    <span className="font-medium text-gray-700">{comment.author.name || 'Anonymous'}</span>
                    <span className="text-gray-500 text-xs ml-2">{formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          <form ref={commentFormRef} action={handleCommentSubmit} className="mt-4 flex">
            <input
              type="text"
              name="content"
              placeholder="Add a comment..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isCommentPending}
            >
              {isCommentPending ? 'Posting...' : 'Comment'}
            </button>
          </form>
          {commentState?.error && <p className="text-red-500 text-sm mt-2">{commentState.error}</p>}
        </div>
      )}
    </div>
  );
}

