import { roles, userTable } from "@data/mockData";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const jwtKey = process.env.TOKEN_SECRET || "default-secret-key";

const methodToPermission = {
  GET: "read_item",
  POST: "create_item",
  PUT: "update_item",
  DELETE: "delete_item",
};

// authenticate user
export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")?.[1];
  if (!token) {
    res.status(401).json({ error: "No token provided" });
  } else next();
}

// check if user has permission to read/update/delete item & item belongs to user
export function checkItemPermission(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")?.[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtKey);

    const { id, role } = decoded as {
      id: number;
      role: string;
    };

    const permisions = roles.find((r) => r.role === role)?.permissions;

    const action =
      methodToPermission[req.method as keyof typeof methodToPermission];

    if (!permisions?.includes(action)) {
      res
        .status(403)
        .json({ error: `User does not have permission to ${action}` });
    } else if (
      req.params.id &&
      !userTable
        .getUserItems(id)
        .find((item) => item.id === parseInt(req.params.id))
    ) {
      res.status(403).json({ error: "Item does not belong to user" });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
