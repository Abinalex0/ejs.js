// server.js
const express = require("express");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));

// Register form
app.get("/register", (req, res) => {
  res.render("register");
});

// Login form
app.get("/login", (req, res) => {
  res.render("login");
});

// Handle register POST
app.post("/register", (req, res) => {
    console.log('hiiiiiiiiiiiiiii')
  const { name, email, password } = req.body;
  res.send(`Registered user: ${name}, Email: ${email}`);
});

// Handle login POST
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  res.send(`Logged in with Email: ${email}`);
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
