import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SignInRequest } from "@shared/types";
import prisma from "../../services/db";
import * as argon2 from "argon2";
const jwtKey = process.env.TOKEN_SECRET || "default-secret-key";

export async function signIn(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as SignInRequest;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await argon2.verify(user.password, password))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    jwtKey,
    {
      algorithm: "HS256",
      expiresIn: "1h",
    }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}
