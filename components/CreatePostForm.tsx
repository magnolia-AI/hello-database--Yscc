'use client';

import { useRef, useActionState, useEffect } from 'react';
import { createPostFormAction } from '@/app/actions/posts';

interface CreatePostFormProps {
  currentUserId: string; // Assuming we have the current user's ID
}

export function CreatePostForm({ currentUserId }: CreatePostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, isPending] = useActionState(createPostFormAction, null);

  // Use useEffect to react to state changes and reset form on success
  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-3">Create New Post</h3>
      <form ref={formRef} action={action} className="space-y-3">
        <textarea
          name="content"
          placeholder="What's on your mind?"
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <input type="hidden" name="authorId" value={currentUserId} />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={isPending}
        >
          {isPending ? 'Posting...' : 'Post'}
        </button>
        {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
      </form>
    </div>
  );
}

