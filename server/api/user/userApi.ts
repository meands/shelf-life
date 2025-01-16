import express, { Request, Response } from "express";
import { CreateUserRequest, UpdateUserRequest } from "@shared/types";
import jwt from "jsonwebtoken";
import prisma from "../../services/db";
import { hash } from "argon2";
import { Prisma } from "@prisma/client";

const jwtKey = process.env.TOKEN_SECRET || "default-secret-key";
const jwtExpirySeconds = 60000;

const router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        email: true,
        role: true,
        password: false,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        displayName: true,
        email: true,
        role: true,
        password: false,
      },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

router.post(
  "/",
  async (req: Request<{}, {}, CreateUserRequest>, res: Response) => {
    try {
      const hashedPassword = await hash(req.body.password);
      const newUser = await prisma.user.create({
        data: {
          ...req.body,
          password: hashedPassword,
        },
        select: {
          id: true,
          displayName: true,
          email: true,
          role: true,
          password: false,
        },
      });

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        jwtKey,
        {
          algorithm: "HS256",
          expiresIn: jwtExpirySeconds,
        }
      );

      res.status(201).json({ ...newUser, token });
    } catch (error) {
      console.error("Error creating user:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          res.status(400).json({ message: "Email already exists" });
          return;
        }
      }
      res.status(500).json({ message: "Error creating user" });
    }
  }
);

router.put(
  "/:id",
  async (
    req: Request<{ id: string }, {}, UpdateUserRequest>,
    res: Response
  ) => {
    try {
      const userId = parseInt(req.params.id);
      const updateData = { ...req.body };

      if (updateData.password) {
        updateData.password = await hash(updateData.password);
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          displayName: true,
          email: true,
          role: true,
          password: false,
        },
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          res.status(404).json({ message: "User not found" });
          return;
        }
      }
      res.status(500).json({ message: "Error updating user" });
    }
  }
);

router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        res.status(404).json({ message: "User not found" });
        return;
      }
    }
    res.status(500).json({ message: "Error deleting user" });
  }
});

router.get(
  "/:userId/items",
  async (req: Request<{ userId: string }>, res: Response) => {
    try {
      const items = await prisma.item.findMany({
        where: { userId: parseInt(req.params.userId) },
        include: {
          labels: true,
          notes: true,
        },
      });
      if (!items.length)
        return res.status(404).json({ message: "No items found" });
      res.status(200).json(items);
    } catch (error) {
      console.error("Error fetching user items:", error);
      res.status(500).json({ message: "Error fetching user items" });
    }
  }
);

export default router;
