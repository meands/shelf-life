import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        displayName: "John Doe",
        email: "john@doe.com",
        password: "password",
      },
      {
        displayName: "Jane Doe",
        email: "jane@doe.com",
        password: "password",
      },
      {
        displayName: "Jim Doe",
        email: "jim@doe.com",
        password: "password",
      },
      {
        displayName: "Jill Doe",
        email: "jill@doe.com",
        password: "password",
      },
      {
        displayName: "Jack Doe",
        email: "jack@doe.com",
        password: "password",
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

  await prisma.label.createMany({
    data: [
      {
        name: "Fruit",
        colour: "#FF7F00",
      },
      {
        name: "Vegetable",
        colour: "#00FF00",
      },
      {
        name: "Meat",
        colour: "#FF0000",
      },
      {
        name: "Dairy",
        colour: "#0000FF",
      },
    ],
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
