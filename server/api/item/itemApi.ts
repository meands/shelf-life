import express, { Request, Response } from "express";
import prisma from "../../services/db";
import { Prisma } from "@prisma/client";
import { authenticateUser } from "../../middleware/auth";
import { UpdateItemRequest } from "@shared/types";
import { CreateItemRequest } from "@shared/types";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateUser);

router.get("/", async (req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      where: {
        userId: (req as any).user.id,
      },
      include: {
        labels: true,
        notes: true,
      },
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
    if (!item) return res.status(404).json({ message: "Item not found" });
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
      const { notes: noteTexts, labels, ...itemData } = req.body;

      const item = await prisma.item.create({
        data: {
          ...itemData,
          expiryDate: new Date(itemData.expiryDate),
          userId: (req as any).user.id,
          notes: {
            create: noteTexts.map((note) => ({ note })),
          },
          labels: {
            connect: labels.map((label) => ({ id: label.id })),
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
      const { notes: noteTexts, labels: labelIds, ...itemData } = req.body;

      // Verify item belongs to user
      const existingItem = await prisma.item.findUnique({
        where: {
          id: itemId,
          userId: (req as any).user.id,
        },
      });

      if (!existingItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      // Delete existing notes
      await prisma.note.deleteMany({
        where: { itemId },
      });

      const item = await prisma.item.update({
        where: { id: itemId },
        data: {
          ...itemData,
          expiryDate: new Date(itemData.expiryDate),
          notes: {
            create: noteTexts.map((note) => ({ note })),
          },
          labels: {
            set: labelIds.map((id) => ({ id: Number(id) })),
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
    // Verify item belongs to user
    const item = await prisma.item.findUnique({
      where: {
        id: parseInt(req.params.id),
        userId: (req as any).user.id,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await prisma.item.delete({
      where: { id: item.id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting item:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ message: "Item not found" });
        return;
      }
    }
    res.status(500).json({ message: "Error deleting item" });
  }
});

export default router;
