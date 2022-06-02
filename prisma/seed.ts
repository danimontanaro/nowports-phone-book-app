import { PrismaClient, Prisma, Contact } from "@prisma/client";

const prisma = new PrismaClient();

const contactsData: Prisma.Contact[] = [
  {
    firstName: "Daniela",
    lastName: "montanaro",
    phone: 92815836,
    id: 10,
  },
  {
    firstName: "Jose",
    lastName: "Martinez",
    phone: 12321313,
    id: 18,
  },
  {
    firstName: "Pepe",
    lastName: "Pepinoo",
    phone: 123123,
    id: 2,
  },
  {
    firstName: "Rubi",
    lastName: "Perez",
    phone: 1234566,
    id: 1,
  },
];
async function main() {
  console.log(`Start seeding ...`);
  for (const u of contactsData) {
    const contact = await prisma.contact.create({
      data: u,
    });
    console.log(`Created contact with id: ${contact.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
