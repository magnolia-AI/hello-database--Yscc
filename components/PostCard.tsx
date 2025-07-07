'use client';

import { Post, User, Comment as CommentType, Like } from '@prisma/client';
import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, MessageCircle } from 'lucide-react';
import { toggleLike, createComment } from '@/app/actions/posts';
import { useState, useRef, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface PostCardProps {
  post: Post & {
    author: User;
    comments: (CommentType & { author: User })[];
    likes: Like[];
  };
  currentUserId: string;
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
      setShowComments(true);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>{getInitials(post.author.name || 'A')}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold">{post.author.name || 'Anonymous'}</span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNowStrict(new Date(post.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground">{post.content}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={handleToggleLike}>
            <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
            {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="w-5 h-5 mr-2" />
            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </Button>
        </div>
        {showComments && (
          <div className="w-full mt-4">
            <Separator />
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-lg">Comments</h4>
              {post.comments.length === 0 ? (
                <p className="text-muted-foreground">No comments yet.</p>
              ) : (
                <div className="space-y-4">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                       <Avatar className="w-8 h-8">
                        <AvatarFallback>{getInitials(comment.author.name || 'A')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-sm">{comment.author.name || 'Anonymous'}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNowStrict(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <form action={handleCommentSubmit} ref={commentFormRef} className="flex items-center space-x-2 mt-4">
              <Input name="content" placeholder="Write a comment..." required />
              <Button type="submit" disabled={isCommentPending}>
                {isCommentPending ? 'Posting...' : 'Post'}
              </Button>
            </form>
            {commentState?.error && <p className="text-red-500 text-sm mt-2">{commentState.error}</p>}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

