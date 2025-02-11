import express, { Request, Response } from "express";
import prisma from "../../services/db";
import { Prisma } from "@prisma/client";
import { authenticateUser } from "../../middleware/auth";
import { UpdateItemRequest } from "@shared/types";
import { CreateItemRequest } from "@shared/types";

const router = express.Router();

router.use(authenticateUser);

router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      where: {
        userId: (req as any).user.id,
      },
      include: {
        labels: {
          orderBy: {
            createdAt: "asc",
          },
        },
        notes: {
          orderBy: {
            createdAt: "asc",
          },
        },
        reminders: true,
      },
      orderBy: [
        {
          createdAt: "asc",
        },
        { updatedAt: "asc" },
        { id: "asc" },
      ],
    });
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: parseInt(req.params.id),
        userId: (req as any).user.id,
      },
      include: {
        labels: true,
        notes: true,
      },
    });
    if (!item)
      return res.status(404).json({ message: "Item not found for this user" });
    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ message: "Error fetching item" });
  }
});

router.post(
  "/",
  async (req: Request<{}, {}, CreateItemRequest>, res: Response) => {
    try {
      const { notes, labels, ...itemData } = req.body;

      const item = await prisma.item.create({
        data: {
          ...itemData,
          quantity: itemData.quantity,
          expiryDate: new Date(itemData.expiryDate),
          userId: (req as any).user.id,
          notes: {
            create: notes.map((note) => ({ note: note.note })),
          },
          labels: {
            connectOrCreate: labels.map((label) => ({
              create: {
                name: label.name,
                colour: label.colour,
                description: label.description,
                userId: (req as any).user.id,
              },
              where: { id: label.id || 0 },
            })),
          },
        },
        include: {
          labels: true,
          notes: true,
        },
      });

      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating item:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(400).json({ message: "One or more labels not found" });
          return;
        }
      }
      res.status(500).json({ message: "Error creating item" });
    }
  }
);

router.put(
  "/:id",
  async (
    req: Request<{ id: string }, {}, UpdateItemRequest>,
    res: Response
  ) => {
    try {
      const itemId = parseInt(req.params.id);
      const { notes, labels, ...itemData } = req.body;

      const existingItem = await prisma.item.findUnique({
        where: {
          id: itemId,
          userId: (req as any).user.id,
        },
        include: {
          notes: true,
        },
      });

      if (!existingItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Handle notes updates
      const existingNoteIds = existingItem.notes.map((n) => n.id);
      const updatedNoteIds = notes.filter((n) => n.id).map((n) => n.id);

      const notesToDelete = existingNoteIds.filter(
        (id) => !updatedNoteIds.includes(id)
      );
      const notesToCreate = notes
        .filter((n) => !n.id)
        .map((n) => ({ note: n.note }));
      const notesToUpdate = notes
        .filter((n) => n.id)
        .map((n) => ({
          where: { id: n.id },
          data: { note: n.note },
        }));

      const item = await prisma.item.update({
        where: { id: itemId },
        data: {
          ...itemData,
          expiryDate: new Date(itemData.expiryDate),
          notes: {
            deleteMany: { id: { in: notesToDelete } },
            create: notesToCreate,
            update: notesToUpdate,
          },
          labels: {
            connectOrCreate: labels.map((label) => ({
              create: {
                name: label.name,
                colour: label.colour,
                description: label.description,
                userId: (req as any).user.id,
              },
              where: { id: label.id || 0 },
            })),
          },
        },
        include: {
          labels: true,
          notes: true,
        },
      });

      res.status(200).json(item);
    } catch (error) {
      console.error("Error updating item:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Item not found" });
          return;
        }
      }
      res.status(500).json({ message: "Error updating item" });
    }
  }
);

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const item = await prisma.item.findUnique({
      where: {
        id: parseInt(req.params.id),
        userId: (req as any).user.id,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found for this user" });
    }

    await prisma.item.delete({
      where: { id: item.id },
    });
    res.status(200).send(item);
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Error deleting item" });
  }
});

export default router;
