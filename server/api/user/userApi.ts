import { userTable } from "@data/mockData";
import express, { Request, Response } from "express";
import { CreateUserRequest, UpdateUserRequest } from "@shared/types";
import jwt from "jsonwebtoken";
const jwtKey = process.env.TOKEN_SECRET || "default-secret-key";
const jwtExpirySeconds = 60000;

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json(userTable.getAllUsers());
});

router.get("/:id", (req: Request<{ id: string }>, res: Response) => {
  const user = userTable.getUser(parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json(user);
});

router.post("/", (req: Request<{}, {}, CreateUserRequest>, res: Response) => {
  const newUser = userTable.createUser(req.body);

  const token = jwt.sign(
    { id: newUser.id, email: newUser.email, role: newUser.role },
    jwtKey,
    {
      algorithm: "HS256",
      expiresIn: jwtExpirySeconds,
    }
  );

  res.status(201).json({ ...newUser, token });
});

router.put(
  "/:id",
  (req: Request<{ id: string }, {}, UpdateUserRequest>, res: Response) => {
    const userId = parseInt(req.params.id);
    const existingUser = userTable.getUser(userId);
    if (!existingUser)
      return res.status(404).json({ message: "User not found" });

    const updatedUser = userTable.updateUser({ ...req.body, id: userId });
    res.status(200).json(updatedUser);
  }
);

router.delete("/:id", (req: Request<{ id: string }>, res: Response) => {
  const userId = parseInt(req.params.id);
  const existingUser = userTable.getUser(userId);
  if (!existingUser) return res.status(404).json({ message: "User not found" });

  userTable.deleteUser(userId);
  res.status(204).send();
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
