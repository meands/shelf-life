import express, { Request, Response } from "express";
import prisma from "../../services/db";
import { Prisma } from "@prisma/client";
import { authenticateUser } from "../../middleware/auth";

const router = express.Router();

router.use(authenticateUser);

router.get("/", async (_req: Request, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      include: {
        item: true,
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ message: "Error fetching notes" });
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        item: true,
      },
    });
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note:", error);
    res.status(500).json({ message: "Error fetching note" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    // Verify user has access to the item
    const item = await prisma.item.findUnique({
      where: {
        id: req.body.itemId,
        userId: (req as any).user.id,
      },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const note = await prisma.note.create({
      data: req.body,
      include: {
        item: true,
      },
    });
    res.status(201).json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    // Verify user has access to the note's item
    const existingNote = await prisma.note.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        item: true,
      },
    });

    if (!existingNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (existingNote.item.userId !== (req as any).user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const note = await prisma.note.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      include: {
        item: true,
      },
    });
    res.status(200).json(note);
  } catch (error) {
    console.error("Error updating note:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ message: "Note not found" });
        return;
      }
    }
    res.status(500).json({ message: "Error updating note" });
  }
});

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    // Verify user has access to the note's item
    const note = await prisma.note.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        item: true,
      },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.item.userId !== (req as any).user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.note.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting note:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ message: "Note not found" });
        return;
      }
    }
    res.status(500).json({ message: "Error deleting note" });
  }
});

export default router;
