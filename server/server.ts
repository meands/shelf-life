import "module-alias/register";

import express from "express";
import cors from "cors";

import { signIn, welcome } from "@api/auth/authApi";

import itemRouter from "@api/item/itemApi";
import labelRouter from "@api/label/labelApi";
import noteRouter from "@api/note/noteApi";
import userRouter from "@api/user/userApi";
import { authenticateUser } from "@api/auth/itemMiddleware";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.post("/signIn", signIn);
app.get("/welcome", welcome);

itemRouter.use(authenticateUser);
app.use("/items", itemRouter);
app.use("/labels", labelRouter);
app.use("/notes", noteRouter);
app.use("/users", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
