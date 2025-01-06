const jwt = require("jsonwebtoken");

const jwtKey = process.env.TOKEN_SECRET;
const jwtExpirySeconds = 300;

const users = {
    'abc@abc.com': 'wefjsdlfksj',
    'xyz@xyz.com': 'cdsnofwejfds',
}

function signIn(req, res) {
    const { email, password } = req.body;
    if (!users[email] || users[email] !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ email }, jwtKey, { algorithm: "HS256", expiresIn: jwtExpirySeconds });

    res.json({ token });
}

function welcome(req, res) {
    const token = req.headers.authorization?.split(' ')?.[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, jwtKey);
        res.send(`Welcome ${decoded.username}`);
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}

module.exports = { signIn, welcome };