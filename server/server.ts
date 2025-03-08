import "module-alias/register";

import express from "express";
import cors from "cors";

import { signIn } from "@api/auth/authApi";

import itemRouter from "@api/item/itemApi";
import labelRouter from "@api/label/labelApi";
import noteRouter from "@api/note/noteApi";
import userRouter from "@api/user/userApi";
import { authenticateUser } from "@middleware/auth";
import reminderRouter from "@api/reminder/reminderApi";
import recipeRouter from "@api/recipe/recipeApi";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signIn", signIn);
app.use("/users", userRouter);
app.use("/recipes", recipeRouter);

app.use(authenticateUser);

app.use("/items", itemRouter);
app.use("/labels", labelRouter);
app.use("/notes", noteRouter);
app.use("/reminders", reminderRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
