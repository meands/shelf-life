import express, { Request, Response } from "express";
import prisma from "../../services/db";
import { CreateReminderRequest, UpdateReminderRequest } from "@shared/types";

const router = express.Router();

// Get all reminders for user
router.get("/", async (req: Request, res: Response) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        userId: (req as any).user.id,
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

// Create reminder
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
