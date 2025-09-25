const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("./userQueries");
const app = express();
const PORT = 3000;
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
  })
);
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect("/login");
}
app.get("/register", (req, res) => {
  res.render("register", { message: null });
});
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.render("register", { message: "User already exists " });
    }

    await createUser({ name, email, password });
    res.render("login", { message: "User registered successfully  Please log in." });
  } catch (err) {
    res.render("register", { message: "Server error " });
  }
});
app.get("/login", (req, res) => {
  res.render("login", { message: null });
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.render("login", { message: "User not found " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { message: "Invalid password " });

    req.session.userId = user._id;
    req.session.userName = user.name;
    res.redirect("/dashboard");
  } catch (err) {
    res.render("login", { message: "Server error " });
  }
});

app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { name: req.session.userName });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(PORT, () =>
  console.log(` Server running at http://localhost:${PORT}`)
);
