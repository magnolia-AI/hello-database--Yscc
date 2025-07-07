import prisma from '@/lib/prisma';
import { PostCard } from '@/components/PostCard';
import { CreatePostForm } from '@/components/CreatePostForm';
import { Card, CardContent } from '@/components/ui/card';

export default async function HomePage() {
  // For demonstration, assuming a fixed current user ID. In a real app, this would come from auth.
  const currentUserId = 'clx0z422s0000a8ny21222222'; // Replace with a valid user ID from your seeded data or auth system

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      comments: {
        include: { author: true },
        orderBy: { createdAt: 'asc' },
      },
      likes: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="flex min-h-screen flex-col items-center bg-muted/40 p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-muted-foreground mb-6 text-center">Social Feed</h1>
        
        <CreatePostForm currentUserId={currentUserId} />

        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground text-lg">No posts yet. Be the first to share something!</p>
              </CardContent>
            </Card>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

