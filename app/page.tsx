import prisma from '@/lib/prisma';
import { EnhancedPostCard } from '@/components/EnhancedPostCard';
import { EnhancedCreatePostForm } from '@/components/EnhancedCreatePostForm';
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
    <div className="flex justify-center bg-muted/30 min-h-screen">
      <div className="w-full max-w-2xl p-4 md:p-6">
        {/* Create Post Section */}
        <div className="mb-6">
          <EnhancedCreatePostForm currentUserId={currentUserId} />
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">No posts yet</h3>
                  <p className="text-muted-foreground">Be the first to share something with the community!</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            posts.map(post => (
              <EnhancedPostCard key={post.id} post={post} currentUserId={currentUserId} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}


