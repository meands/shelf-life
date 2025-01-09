const express = require("express");
const cors = require("cors");

const { signIn, welcome } = require("./authUtils");
const itemRouter = require("./api/item/itemApi");
const labelRouter = require("./api/label/labelApi");
const noteRouter = require("./api/note/noteApi");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/signIn", signIn);

app.get("/welcome", welcome);

app.use("/items", itemRouter);

app.use("/labels", labelRouter);

app.use("/notes", noteRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
