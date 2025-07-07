'use client';

import { useRef, useActionState, useEffect, useState } from 'react';
import { createPostFormAction } from '@/app/actions/posts';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Image, Smile, MapPin, Calendar, MoreHorizontal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EnhancedCreatePostFormProps {
  currentUserId: string;
  currentUser?: {
    name: string;
    id: string;
  };
}

export function EnhancedCreatePostForm({ currentUserId, currentUser }: EnhancedCreatePostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [state, action, isPending] = useActionState(createPostFormAction, null);
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setContent('');
      setIsFocused(false);
    }
  }, [state]);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const characterLimit = 280;
  const remainingChars = characterLimit - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <Card className="mb-6 border-0 shadow-sm bg-background">
      <CardContent className="p-6">
        <form ref={formRef} action={action} className="space-y-4">
          <div className="flex space-x-4">
            {/* User Avatar */}
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                {currentUser ? getInitials(currentUser.name) : 'U'}
              </AvatarFallback>
            </Avatar>

            {/* Post Content Area */}
            <div className="flex-1 space-y-4">
              <Textarea
                ref={textareaRef}
                name="content"
                placeholder="What's happening?"
                value={content}
                onChange={handleTextareaChange}
                onFocus={() => setIsFocused(true)}
                className="min-h-[120px] resize-none border-0 p-0 text-xl placeholder:text-muted-foreground focus-visible:ring-0 bg-transparent"
                maxLength={characterLimit + 50} // Allow slight overflow for warning
                required
              />
              <input type="hidden" name="authorId" value={currentUserId} />

              {/* Media and Options Bar */}
              {(isFocused || content.length > 0) && (
                <div className="space-y-4">
                  <Separator />
                  
                  {/* Media Options */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button type="button" variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                        <Image className="h-5 w-5 mr-2" />
                        Photo
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                        <Smile className="h-5 w-5 mr-2" />
                        Emoji
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                        <MapPin className="h-5 w-5 mr-2" />
                        Location
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                        <Calendar className="h-5 w-5 mr-2" />
                        Schedule
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Character Count and Post Button */}
                    <div className="flex items-center space-x-3">
                      {content.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className={`text-sm ${isOverLimit ? 'text-red-500' : remainingChars <= 20 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                            {remainingChars}
                          </div>
                          <div className="w-8 h-8 relative">
                            <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-muted-foreground/20"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className={isOverLimit ? 'text-red-500' : remainingChars <= 20 ? 'text-orange-500' : 'text-blue-500'}
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={`${Math.min(100, (content.length / characterLimit) * 100)}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      <Button 
                        type="submit" 
                        disabled={isPending || content.trim().length === 0 || isOverLimit}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50"
                      >
                        {isPending ? 'Posting...' : 'Post'}
                      </Button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {state?.error && (
                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
                      {state.error}
                    </div>
                  )}

                  {/* Success Message */}
                  {state?.success && (
                    <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                      Your post has been shared successfully!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

