'use server'

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Helper type for consistent action responses
type ActionResult<T = any> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};

// --- Post Actions ---

export async function createPostFormAction(prevState: any, formData: FormData) {
  const content = formData.get('content') as string;
  const authorId = formData.get('authorId') as string;

  if (!content || content.trim() === '') {
    return { error: 'Post content cannot be empty.' };
  }

  if (!authorId) {
    return { error: 'Author ID is missing.' };
  }

  try {
    await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: authorId,
      },
    });
    revalidatePath('/'); // Revalidate the home page to show new post
  } catch (error) {
    console.error('Error creating post:', error);
    return { error: 'Failed to create post. Please try again.' };
  }
  redirect('/');
}

// Programmatic version of createPost (if needed for API calls, etc.)
export async function createPost(content: string, authorId: string): Promise<ActionResult<any>> {
  if (!content || content.trim() === '') {
    return { success: false, error: 'Post content cannot be empty.' };
  }

  if (!authorId) {
    return { success: false, error: 'Author ID is missing.' };
  }

  try {
    const post = await prisma.post.create({
      data: {
        content: content.trim(),
        authorId: authorId,
      },
    });
    revalidatePath('/');
    return { success: true, data: post };
  } catch (error) {
    console.error('Error creating post programmatically:', error);
    return { success: false, error: 'Failed to create post programmatically.' };
  }
}

// --- Comment Actions ---

export async function createComment(formData: FormData) {
  const content = formData.get('content') as string;
  const authorId = formData.get('authorId') as string; // Assuming authorId is passed
  const postId = formData.get('postId') as string;


// --- Like Actions ---

export async function toggleLike(formData: FormData) {
  const userId = formData.get('userId') as string;
  const postId = formData.get('postId') as string;

  if (!userId || !postId) {
    return { success: false, error: 'User ID and Post ID are required.' };
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // User has already liked the post, so unlike it
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      revalidatePath('/');
      return { success: true, liked: false };
    } else {
      // User has not liked the post, so like it
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      revalidatePath('/');
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return { success: false, error: 'Failed to toggle like. Please try again.' };
  }
}


  if (!content || content.trim() === '') {
    return { error: 'Comment content cannot be empty.' };
  }

  if (!authorId || !postId) {
    return { error: 'Author ID or Post ID is missing.' };
  }

  try {
    await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: authorId,
        postId: postId,
      },
    });
    revalidatePath('/'); // Revalidate to show the new comment
    return { success: true };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { error: 'Failed to create comment. Please try again.' };
  }
}

