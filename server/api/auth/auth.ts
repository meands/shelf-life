import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SignInRequest } from "@shared/types";
import * as argon2 from "argon2";
import prisma from "@expiry-tracker/shared/prisma/prisma";

const jwtKey = process.env.TOKEN_SECRET as string;

export async function signIn(req: Request, res: Response) {
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

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, jwtKey) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};
