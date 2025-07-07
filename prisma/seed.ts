import prisma from '@/lib/prisma';

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      email: 'alice@example.com',
      name: 'Alice',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob',
    },
  });

  // Create sample posts
  const post1 = await prisma.post.upsert({
    where: { id: 'post1_id' }, // Using a fixed ID for upsert to work consistently
    update: {},
    create: {
      id: 'post1_id',
      content: 'Hello, this is Alice\'s first post!',
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 'post2_id' }, // Using a fixed ID for upsert to work consistently
    update: {},
    create: {
      id: 'post2_id',
      content: 'Bob is sharing some thoughts here.',
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.upsert({
    where: { id: 'post3_id' }, // Using a fixed ID for upsert to work consistently
    update: {},
    create: {
      id: 'post3_id',
      content: 'Alice\'s second post, feeling good!',
      authorId: user1.id,
    },
  });

  // Create sample comments
  await prisma.comment.upsert({
    where: { id: 'comment1_id' },
    update: {},
    create: {
      id: 'comment1_id',
      content: 'Great post, Alice!',
      authorId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.comment.upsert({
    where: { id: 'comment2_id' },
    update: {},
    create: {
      id: 'comment2_id',
      content: 'Thanks, Bob!',
      authorId: user1.id,
      postId: post1.id,
    },
  });

  // Create sample likes
  await prisma.like.upsert({
    where: { userId_postId: { userId: user2.id, postId: post1.id } },
    update: {},
    create: {
      userId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.like.upsert({
    where: { userId_postId: { userId: user1.id, postId: post2.id } },
    update: {},
    create: {
      userId: user1.id,
      postId: post2.id,
    },
  });

  console.log('Sample data seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

