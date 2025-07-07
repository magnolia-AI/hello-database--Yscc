'use client';

import { useRef, useActionState, useEffect } from 'react';
import { createPostFormAction } from '@/app/actions/posts';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CreatePostFormProps {
  currentUserId: string;
}

export function CreatePostForm({ currentUserId }: CreatePostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, isPending] = useActionState(createPostFormAction, null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create New Post</CardTitle>
      </CardHeader>
      <form ref={formRef} action={action}>
        <CardContent>
          <Textarea
            name="content"
            placeholder="What's on your mind?"
            rows={4}
            required
          />
          <input type="hidden" name="authorId" value={currentUserId} />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
          <Button type="submit" disabled={isPending} className="ml-auto">
            {isPending ? 'Posting...' : 'Post'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

