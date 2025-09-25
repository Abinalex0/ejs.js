const express = require("express");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("./userQueries");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists " });
    }
    const result = await createUser({ name, email, password });
    res.status(201).json({ message: "User registered ", userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Server error ", details: err.message });
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "User not found " });
    }
 const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password " });
    }
  res.json({ message: `Welcome back, ${user.name} ` });
  } catch (err) {
    res.status(500).json({ error: "Server error ", details: err.message });
  }
});
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));
