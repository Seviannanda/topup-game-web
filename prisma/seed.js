const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.game.create({
    data: {
      name: 'Mobile Legends',
      slug: 'mobile-legends',
      imageUrl: '/images/mobile-legends.jpg',
      description: 'Top up Diamond Mobile Legends termurah dan terpercaya',
      products: {
        create: [
          { name: '86 Diamond', price: 20000 },
          { name: '172 Diamond', price: 40000 },
          { name: '257 Diamond', price: 60000 },
          { name: '344 Diamond', price: 80000 },
          { name: '706 Diamond', price: 150000 },
        ],
      },
    },
  });

  await prisma.game.create({
    data: {
      name: 'Free Fire',
      slug: 'free-fire',
      imageUrl: '/images/free-fire.jpg',
      description: 'Top up Diamond Free Fire instant',
      products: {
        create: [
          { name: '70 Diamond', price: 10000 },
          { name: '140 Diamond', price: 20000 },
          { name: '355 Diamond', price: 50000 },
          { name: '720 Diamond', price: 100000 },
        ],
      },
    },
  });

  console.log('Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });