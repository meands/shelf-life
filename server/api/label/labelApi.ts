import express, { Request, Response } from "express";
import { itemLabelRelationTable, labelTable } from "../../data/mockData";
import { CreateLabelRequest, UpdateLabelRequest } from "../../types";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json(labelTable.getAllLabels());
});

router.get("/:id", (req: Request, res: Response) => {
  const label = labelTable.getLabel(parseInt(req.params.id));
  if (!label) {
    res.status(404).json({ message: "Label not found" });
    return;
  }
  res.status(200).json(label);
});

router.post("/", (req: Request, res: Response) => {
  const labelData = req.body as CreateLabelRequest;
  const newLabel = labelTable.addLabel(labelData);
  res.status(201).json(newLabel);
});

router.put("/:id", (req: Request, res: Response) => {
  const labelData = req.body as UpdateLabelRequest;
  labelTable.updateLabel(labelData);
  res.status(200).json(labelData);
});

router.delete("/:id", (req: Request, res: Response) => {
  const labelId = parseInt(req.params.id);
  const label = labelTable.getLabel(labelId);

  if (!label) {
    res.status(404).json({ message: "Label not found" });
    return;
  }

  if (
    itemLabelRelationTable
      .getAllRelations()
      .some((relation) => relation.labelId === labelId)
  ) {
    res.status(400).json({
      message: "Cannot delete label as it is associated with items",
    });
    return;
  }

  labelTable.removeLabel(label);
  res.status(200).json(label);
});

export default router;
