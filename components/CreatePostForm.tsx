'use client';

import { useRef, useActionState } from 'react';
import { createPost } from '@/app/actions/posts';

interface CreatePostFormProps {
  currentUserId: string; // Assuming we have the current user's ID
}

export function CreatePostForm({ currentUserId }: CreatePostFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, isPending] = useActionState(createPost, null);

  const handleSubmit = async (formData: FormData) => {
    formData.append('authorId', currentUserId);
    await action(formData);
    if (state?.success) {
      formRef.current?.reset();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-lg font-semibold mb-3">Create New Post</h3>
      <form ref={formRef} action={handleSubmit} className="space-y-3">
        <textarea
          name="content"
          placeholder="What's on your mind?"
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          required
        />
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

