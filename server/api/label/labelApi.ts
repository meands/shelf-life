import express, { Request, Response } from "express";
import { CreateLabelRequest, UpdateLabelRequest } from "@shared/types";
import prisma from "../../services/db";
import { Prisma } from "@prisma/client";
import { authenticateUser } from "../../middleware/auth";

const router = express.Router();

router.use(authenticateUser);

router.get("/", async (_req: Request, res: Response) => {
  try {
    const labels = await prisma.label.findMany();
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ message: "Error fetching labels" });
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const label = await prisma.label.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!label) return res.status(404).json({ message: "Label not found" });
    res.status(200).json(label);
  } catch (error) {
    console.error("Error fetching label:", error);
    res.status(500).json({ message: "Error fetching label" });
  }
});

router.post(
  "/",
  async (req: Request<{}, {}, CreateLabelRequest>, res: Response) => {
    try {
      const label = await prisma.label.create({
        data: req.body,
      });
      res.status(201).json(label);
    } catch (error) {
      console.error("Error creating label:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          res.status(400).json({ message: "Label name must be unique" });
          return;
        }
      }
      res.status(500).json({ message: "Error creating label" });
    }
  }
);

router.put(
  "/:id",
  async (
    req: Request<{ id: string }, {}, UpdateLabelRequest>,
    res: Response
  ) => {
    try {
      const label = await prisma.label.update({
        where: { id: parseInt(req.params.id) },
        data: req.body,
      });
      res.status(200).json(label);
    } catch (error) {
      console.error("Error updating label:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "Label not found" });
          return;
        }
        if (error.code === "P2002") {
          res.status(400).json({ message: "Label name must be unique" });
          return;
        }
      }
      res.status(500).json({ message: "Error updating label" });
    }
  }
);

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    await prisma.label.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting label:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ message: "Label not found" });
        return;
      }
      if (error.code === "P2003") {
        res.status(400).json({ message: "Cannot delete label that is in use" });
        return;
      }
    }
    res.status(500).json({ message: "Error deleting label" });
  }
});

export default router;
