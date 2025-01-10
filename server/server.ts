import express from "express";
import cors from "cors";
import { signIn, welcome } from "./authUtils";

import "module-alias/register";
import itemRouter from "@api/item/itemApi";
import labelRouter from "@api/label/labelApi";
import noteRouter from "@api/note/noteApi";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.send("Hello World");
});

app.post("/signIn", signIn);
app.get("/welcome", welcome);

app.use("/items", itemRouter);
app.use("/labels", labelRouter);
app.use("/notes", noteRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
