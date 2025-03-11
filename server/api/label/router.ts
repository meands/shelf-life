import express, { Request, Response } from "express";
import { CreateLabelRequest, UpdateLabelRequest } from "@shared/types";
import prisma from "@expiry-tracker/shared/prisma/prisma";
import { authenticateUser } from "@api/auth/auth";

const router = express.Router();

router.use(authenticateUser);

router.get("/", async (req: Request, res: Response) => {
  try {
    const labels = await prisma.label.findMany({
      where: {
        userId: (req as any).user.id,
      },
    });

    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ message: "Error fetching labels" });
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const label = await prisma.label.findUnique({
      where: { id: parseInt(req.params.id), userId: (req as any).user.id },
      include: {
        items: true,
      },
    });

    if (!label) {
      return res.status(404).json({ message: "Label not found for this user" });
    }

    res.status(200).json(label);
  } catch (error) {
    console.error("Error fetching label:", error);
    res.status(500).json({ message: "Error fetching label" });
  }
});

router.post(
  "/",
  async (req: Request<{}, {}, CreateLabelRequest>, res: Response) => {
    if (req.body.itemIds) {
      const items = await prisma.item.findMany({
        where: {
          id: {
            in: req.body.itemIds,
          },
          userId: (req as any).user.id,
        },
      });
      if (items.length !== req.body.itemIds.length) {
        return res.status(400).json({
          message:
            "Invalid item IDs, ensure provided item IDs belong to the user",
        });
      }
    }

    try {
      const label = await prisma.label.create({
        data: {
          name: req.body.name,
          colour: req.body.colour,
          description: req.body.description,
          userId: (req as any).user.id,
          items: {
            connect: req.body.itemIds?.map((id) => ({ id })),
          },
        },
      });

      res.status(201).json(label);
    } catch (error) {
      console.error("Error creating label:", error);
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
      const existingLabel = await prisma.label.findUnique({
        where: { id: parseInt(req.params.id), userId: (req as any).user.id },
      });
      if (!existingLabel) {
        return res
          .status(404)
          .json({ message: "Label not found for this user" });
      }
      if (req.body.itemIds) {
        const items = await prisma.item.findMany({
          where: {
            id: {
              in: req.body.itemIds,
            },
            userId: (req as any).user.id,
          },
        });
        if (items.length !== req.body.itemIds.length) {
          return res.status(400).json({
            message:
              "Invalid item IDs, ensure provided item IDs belong to the user",
          });
        }
      }
      const label = await prisma.label.update({
        where: { id: parseInt(req.params.id) },
        data: {
          name: req.body.name,
          colour: req.body.colour,
          description: req.body.description,
          items: {
            connect: req.body.itemIds?.map((id) => ({ id })),
          },
        },
      });
      res.status(200).json(label);
    } catch (error) {
      console.error("Error updating label:", error);
      res.status(500).json({ message: "Error updating label" });
    }
  }
);

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const existingLabel = await prisma.label.findUnique({
      where: { id: parseInt(req.params.id), userId: (req as any).user.id },
    });
    if (!existingLabel) {
      return res.status(404).json({ message: "Label not found for this user" });
    }
    await prisma.label.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(200).send({
      message: "Label deleted successfully",
      label: existingLabel,
    });
  } catch (error) {
    console.error("Error deleting label:", error);
    res.status(500).json({ message: "Error deleting label" });
  }
});

export default router;
