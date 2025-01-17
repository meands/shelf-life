import "module-alias/register";

import express from "express";
import cors from "cors";

import { signIn } from "@api/auth/authApi";

import itemRouter from "@api/item/itemApi";
import labelRouter from "@api/label/labelApi";
import noteRouter from "@api/note/noteApi";
import userRouter from "@api/user/userApi";
import { authenticateUser } from "@middleware/auth";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signIn", signIn);
app.use("/users", userRouter);

app.use(authenticateUser);

app.use("/items", itemRouter);
app.use("/labels", labelRouter);
app.use("/notes", noteRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
