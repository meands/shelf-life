const express = require("express");
const { signIn, welcome } = require("./authUtils");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.post("/signIn", signIn);

app.get("/welcome", welcome);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
