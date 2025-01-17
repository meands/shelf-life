import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        displayName: "John Doe",
        email: "john@doe.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$3uBq/uK9JpWEh1AgYUvLoA$Y8WeX1WH0Nxdw7A/fTSYhcBy+tQV0J7hOMAalwFwXIs",
      },
      {
        displayName: "Jane Doe",
        email: "jane@doe.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$3uBq/uK9JpWEh1AgYUvLoA$Y8WeX1WH0Nxdw7A/fTSYhcBy+tQV0J7hOMAalwFwXIs",
      },
      {
        displayName: "Jim Doe",
        email: "jim@doe.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$3uBq/uK9JpWEh1AgYUvLoA$Y8WeX1WH0Nxdw7A/fTSYhcBy+tQV0J7hOMAalwFwXIs",
      },
      {
        displayName: "Jill Doe",
        email: "jill@doe.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$3uBq/uK9JpWEh1AgYUvLoA$Y8WeX1WH0Nxdw7A/fTSYhcBy+tQV0J7hOMAalwFwXIs",
      },
      {
        displayName: "Jack Doe",
        email: "jack@doe.com",
        password:
          "$argon2id$v=19$m=65536,t=3,p=4$3uBq/uK9JpWEh1AgYUvLoA$Y8WeX1WH0Nxdw7A/fTSYhcBy+tQV0J7hOMAalwFwXIs",
      },
    ],
  });

  await prisma.item.createMany({
    data: [
      {
        name: "Apple",
        quantity: 1,
        unit: "kg",
        expiryDate: new Date("2025-01-01"),
        expiryType: "Best Before",
        userId: 1,
      },
      {
        name: "Orange",
        quantity: 1,
        unit: "kg",
        expiryDate: new Date("2025-01-01"),
        expiryType: "Use By",
        userId: 1,
      },
      {
        name: "Banana",
        quantity: 1,
        unit: "kg",
        expiryDate: new Date("2025-02-01"),
        expiryType: "Use By",
        userId: 1,
      },
      {
        name: "Pineapple",
        quantity: 2,
        unit: "unit",
        expiryDate: new Date("2025-03-15"),
        expiryType: "Use By",
        userId: 2,
      },
      {
        name: "Milk",
        quantity: 1,
        unit: "L",
        expiryDate: new Date("2025-03-15"),
        expiryType: "Use By",
        userId: 2,
      },
      {
        name: "Bread",
        quantity: 1,
        unit: "unit",
        expiryDate: new Date("2025-03-15"),
        expiryType: "Use By",
        userId: 3,
      },
      {
        name: "Eggs",
        quantity: 12,
        unit: "unit",
        expiryDate: new Date("2025-03-15"),
        expiryType: "Use By",
        userId: 3,
      },
      {
        name: "Cheese",
        quantity: 1,
        unit: "unit",
        expiryDate: new Date("2025-03-15"),
        expiryType: "Use By",
        userId: 4,
      },
      {
        name: "Butter",
        quantity: 1,
        unit: "unit",
        expiryDate: new Date("2025-03-15"),
        expiryType: "Use By",
        userId: 4,
      },
      {
        name: "Chicken",
        quantity: 1,
        unit: "kg",
        expiryDate: new Date("2025-03-15"),
        expiryType: "Use By",
        userId: 5,
      },
      {
        name: "Beef",
        quantity: 1,
        unit: "kg",
        expiryDate: new Date("2025-03-15"),
        expiryType: "Use By",
        userId: 5,
      },
      {
        name: "Pork",
        quantity: 1,
        unit: "kg",
        expiryDate: new Date("2025-03-15"),
        expiryType: "Use By",
        userId: 5,
      },
    ],
  });

  await prisma.label.create({
    data: {
      name: "Fruit",
      colour: "#FF7F00",
      description:
        "Fruit is a sweet, fleshy, edible fruit that is the result of a plant's flowering process.",
      items: {
        connect: {
          id: 1,
        },
      },
    },
  });

  await prisma.label.create({
    data: {
      name: "Vegetable",
      colour: "#00FF00",
      description:
        "Vegetables are parts of plants that are consumed by humans or other animals as food.",
      items: {
        connect: {
          id: 1,
        },
      },
    },
  });

  await prisma.label.create({
    data: {
      name: "Meat",
      colour: "#FF0000",
      description: "Meat is the flesh of animals that are consumed as food.",
      items: {
        connect: {
          id: 1,
        },
      },
    },
  });

  await prisma.label.create({
    data: {
      name: "Dairy",
      colour: "#0000FF",
      description:
        "Dairy products are foods derived from the milk of mammals, primarily cows, goats, and sheep.",
      items: {
        connect: {
          id: 1,
        },
      },
    },
  });
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
