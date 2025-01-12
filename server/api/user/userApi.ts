import { userTable } from "@data/mockData";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json(userTable.getAllUsers());
});

router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const user = userTable.getUser(parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json(user);
});

router.get(
  "/:userId/items",
  (req: Request<{ userId: string }>, res: Response) => {
    const items = userTable.getUserItems(parseInt(req.params.userId));
    if (!items) return res.status(404).json({ message: "Items not found" });

    res.status(200).json(items);
  }
);

export default router;
