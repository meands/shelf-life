import { PrismaClient } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        displayName: "John Doe",
        email: "john@doe.com",
        password: await argon2.hash("johndoe"),
      },
      {
        displayName: "Jane Doe",
        email: "jane@doe.com",
        password: await argon2.hash("janedoe"),
      },
      {
        displayName: "Jim Doe",
        email: "jim@doe.com",
        password: await argon2.hash("jimdoe"),
      },
      {
        displayName: "Jill Doe",
        email: "jill@doe.com",
        password: await argon2.hash("jilldoe"),
      },
      {
        displayName: "Jack Doe",
        email: "jack@doe.com",
        password: await argon2.hash("jackdoe"),
      },
    ],
  });

  await prisma.reminder.createMany({
    data: [
      {
        userId: 1,
        isEnabled: true,
        daysBeforeExpiry: 10,
      },
      {
        userId: 2,
        isEnabled: true,
        daysBeforeExpiry: 20,
      },
      {
        userId: 3,
        isEnabled: true,
        daysBeforeExpiry: 30,
      },
      {
        userId: 4,
        isEnabled: true,
        daysBeforeExpiry: 40,
      },
      {
        userId: 5,
        isEnabled: true,
        daysBeforeExpiry: 50,
      },
    ],
  });

  await prisma.item.createMany({
    data: [
      {
        name: "Apple",
        quantity: 1.5,
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
      userId: 1,
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
      userId: 1,
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
      userId: 1,
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
      userId: 1,
    },
  });

  await prisma.note.createMany({
    data: [
      {
        note: "This is a note",
        itemId: 1,
      },
      {
        note: "This is a note",
        itemId: 2,
      },
      {
        note: "This is a note",
        itemId: 3,
      },
    ],
  });

  await prisma.reminder.createMany({
    data: [
      {
        itemId: 1,
        userId: 1,
        isEnabled: true,
        daysBeforeExpiry: 1,
      },
      {
        itemId: 2,
        userId: 1,
        isEnabled: true,
        daysBeforeExpiry: 2,
      },
      {
        itemId: 3,
        userId: 1,
        isEnabled: false,
        daysBeforeExpiry: 3,
      },
      {
        itemId: 4,
        userId: 2,
        isEnabled: true,
        daysBeforeExpiry: 4,
      },
      {
        itemId: 5,
        userId: 2,
        isEnabled: true,
        daysBeforeExpiry: 5,
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
