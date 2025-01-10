import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { SignInRequest } from "@shared/types";
const jwtKey = process.env.TOKEN_SECRET || "default-secret-key";
const jwtExpirySeconds = 300;

const users: Record<string, string> = {
  "abc@abc.com": "wefjsdlfksj",
  "xyz@xyz.com": "cdsnofwejfds",
};

export function signIn(req: Request, res: Response): void {
  const { email, password } = req.body as SignInRequest;

  if (!users[email] || users[email] !== password) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = jwt.sign({ email }, jwtKey, {
    algorithm: "HS256",
    expiresIn: jwtExpirySeconds,
  });

  res.json({ token });
}

export function welcome(req: Request, res: Response): void {
  const token = req.headers.authorization?.split(" ")?.[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtKey) as { email: string };
    res.send(`Welcome ${decoded.email}`);
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
