const moduleAlias = require("module-alias");
moduleAlias(__dirname + "/package.json");

import express from "express";
import cors from "cors";

import { signIn, authenticateUser } from "@api/auth/auth";
import itemRouter from "@api/item/router";
import labelRouter from "@api/label/router";
import noteRouter from "@api/note/router";
import userRouter from "@api/user/router";
import reminderRouter from "@api/reminder/router";
import recipeRouter from "@api/recipe/router";

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
