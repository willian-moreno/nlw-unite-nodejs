import { prisma } from '../src/lib/prisma';
async function seed() {
  await prisma.event.create({
    data: {
      id: '59f22216-38df-463d-9dee-08cb16089b63',
      title: 'Unite Summit',
      slug: 'unite-summit',
      details: 'Um evento topzera das galáxias, com diversas stacks para os devs apaixonados por tecnologia! 🚀',
      maximumAttendees: 100,
    },
  })
}

seed().then(() => {
  console.log('Database seeded.')
  prisma.$disconnect()
})