'use client';

import { Post, User, Comment as CommentType, Like } from '@prisma/client';
import { formatDistanceToNowStrict } from 'date-fns';
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Bookmark } from 'lucide-react';
import { toggleLike, createComment } from '@/app/actions/posts';
import { useState, useRef, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface EnhancedPostCardProps {
  post: Post & {
    author: User;
    comments: (CommentType & { author: User })[];
    likes: Like[];
  };
  currentUserId: string;
}

export function EnhancedPostCard({ post, currentUserId }: EnhancedPostCardProps) {
  const [isLiked, setIsLiked] = useState(post.likes.some(like => like.userId === currentUserId));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [retweetCount, setRetweetCount] = useState(Math.floor(Math.random() * 50)); // Mock data
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

  const handleRetweet = () => {
    setIsRetweeted(!isRetweeted);
    setRetweetCount(prev => isRetweeted ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return formatDistanceToNowStrict(date, { addSuffix: true });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' })
      });
    }
  };

  return (
    <Card className="border-0 border-b border-border rounded-none hover:bg-muted/30 transition-colors cursor-pointer">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex space-x-3">
          {/* User Avatar */}
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {getInitials(post.author.name || 'A')}
            </AvatarFallback>
          </Avatar>

          {/* Post Content */}
          <div className="flex-1 min-w-0">
            {/* User Info and Time */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="font-bold text-foreground hover:underline cursor-pointer">
                {post.author.name || 'Anonymous'}
              </span>
              <span className="text-muted-foreground">
                @{(post.author.name || 'anonymous').toLowerCase().replace(' ', '')}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground hover:underline cursor-pointer">
                {formatTime(new Date(post.createdAt))}
              </span>
              <div className="ml-auto">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-foreground text-[15px] leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Engagement Stats */}
            {(likesCount > 0 || post.comments.length > 0 || retweetCount > 0) && (
              <div className="flex items-center space-x-4 mb-3 text-sm text-muted-foreground">
                {retweetCount > 0 && (
                  <span className="hover:underline cursor-pointer">
                    <span className="font-semibold text-foreground">{retweetCount}</span> Retweets
                  </span>
                )}
                {likesCount > 0 && (
                  <span className="hover:underline cursor-pointer">
                    <span className="font-semibold text-foreground">{likesCount}</span> Likes
                  </span>
                )}
                {post.comments.length > 0 && (
                  <span className="hover:underline cursor-pointer" onClick={() => setShowComments(!showComments)}>
                    <span className="font-semibold text-foreground">{post.comments.length}</span> Comments
                  </span>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between max-w-md">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowComments(!showComments)}
                className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50 -ml-2"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                <span className="text-sm">{post.comments.length}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleRetweet}
                className={`text-muted-foreground hover:text-green-500 hover:bg-green-50 ${isRetweeted ? 'text-green-500' : ''}`}
              >
                <Repeat2 className="w-5 h-5 mr-2" />
                <span className="text-sm">{retweetCount}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleToggleLike}
                className={`text-muted-foreground hover:text-red-500 hover:bg-red-50 ${isLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likesCount}</span>
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50"
              >
                <Share className="w-5 h-5" />
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBookmark}
                className={`text-muted-foreground hover:text-blue-500 hover:bg-blue-50 ${isBookmarked ? 'text-blue-500' : ''}`}
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mt-6 space-y-4">
                <Separator />
                
                {/* Comment Form */}
                <form action={handleCommentSubmit} ref={commentFormRef} className="flex space-x-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex space-x-2">
                    <Input 
                      name="content" 
                      placeholder="Tweet your reply..." 
                      className="flex-1 border-0 bg-transparent focus-visible:ring-1 focus-visible:ring-blue-500" 
                      required 
                    />
                    <Button 
                      type="submit" 
                      disabled={isCommentPending}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-full"
                    >
                      {isCommentPending ? 'Replying...' : 'Reply'}
                    </Button>
                  </div>
                </form>

                {commentState?.error && (
                  <p className="text-red-500 text-sm ml-11">{commentState.error}</p>
                )}

                {/* Comments List */}
                {post.comments.length > 0 && (
                  <div className="space-y-4">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="text-xs">
                            {getInitials(comment.author.name || 'A')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm hover:underline cursor-pointer">
                              {comment.author.name || 'Anonymous'}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              @{(comment.author.name || 'anonymous').toLowerCase().replace(' ', '')}
                            </span>
                            <span className="text-muted-foreground text-sm">·</span>
                            <span className="text-muted-foreground text-sm">
                              {formatTime(new Date(comment.createdAt))}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {comment.content}
                          </p>
                          
                          {/* Comment Actions */}
                          <div className="flex items-center space-x-4 mt-2">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50 -ml-2 h-8">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              <span className="text-xs">0</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 hover:bg-red-50 h-8">
                              <Heart className="w-4 h-4 mr-1" />
                              <span className="text-xs">0</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500 hover:bg-blue-50 h-8">
                              <Share className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
