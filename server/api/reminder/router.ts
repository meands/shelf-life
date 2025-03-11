import express, { Request, Response } from "express";
import prisma from "@expiry-tracker/shared/prisma/prisma";
import { CreateReminderRequest, UpdateReminderRequest } from "@shared/types";

const router = express.Router();

// Get all reminders for user
router.get("/", async (req: Request, res: Response) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: (req as any).user.id,
        itemId: {
          not: null,
        },
      },
      include: {
        item: true,
      },
    });
    res.status(200).json(reminders);
  } catch (error) {
    console.error("Error fetching reminders:", error);
    res.status(500).json({ message: "Error fetching reminders" });
  }
});

router.get("/item/:itemId", async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.itemId);
  const reminder = await prisma.reminder.findFirst({
    where: { itemId },
  });
  res.status(200).json(reminder);
});

// get user's default reminder
router.get("/default", async (req: Request, res: Response) => {
  const defaultReminder = await prisma.reminder.findFirst({
    where: { userId: (req as any).user?.id, itemId: null },
  });
  res.status(200).json(defaultReminder);
});

// Upsert reminder
router.put(
  "/",
  async (
    req: Request<{}, {}, CreateReminderRequest | UpdateReminderRequest>,
    res: Response
  ) => {
    try {
      const reminder = await prisma.reminder.upsert({
        where: { id: (req.body as UpdateReminderRequest)?.id || -1 },
        update: req.body,
        create: {
          ...req.body,
          userId: (req as any).user.id,
        },
      });
      res.status(200).json(reminder);
    } catch (error) {
      console.error("Error upserting reminder:", error);
      res.status(500).json({ message: "Error upserting reminder" });
    }
  }
);

router.post(
  "/",
  async (req: Request<{}, {}, CreateReminderRequest>, res: Response) => {
    try {
      const reminder = await prisma.reminder.create({
        data: {
          ...req.body,
          userId: (req as any).user.id,
          isEnabled: req.body.isEnabled ?? true,
        },
        include: {
          item: true,
        },
      });
      res.status(201).json(reminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({ message: "Error creating reminder" });
    }
  }
);

// Update reminder
router.put(
  "/:id",
  async (
    req: Request<{ id: string }, {}, UpdateReminderRequest>,
    res: Response
  ) => {
    try {
      const reminder = await prisma.reminder.update({
        where: {
          id: parseInt(req.params.id),
          userId: (req as any).user.id,
        },
        data: req.body,
        include: {
          item: true,
        },
      });
      res.status(200).json(reminder);
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ message: "Error updating reminder" });
    }
  }
);

// Delete reminder
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    await prisma.reminder.delete({
      where: {
        id: parseInt(req.params.id),
        userId: (req as any).user.id,
      },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting reminder:", error);
    res.status(500).json({ message: "Error deleting reminder" });
  }
});

export default router;
