const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail, getAllUsers } = require("./userQueriess");
const app = express();
const PORT = 3000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: false,
  })
);
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect("/login");
}
app.get("/", (req, res) => res.redirect("/login"));
app.get("/register", (req, res) => res.render("register", { error: null }));
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name);
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.render("register", { error: "Email already registered" });

    await createUser({ name, email, password });
    res.redirect("/login");
  } catch (err) {
    res.render("register", { error: "Registration failed" });
  }
});
app.get("/login", (req, res) => res.render("login", { error: null }));
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user)
      return res.render("login", { error: "Invalid email or password" });
  const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.render("login", { error: "Invalid email or password" });
    req.session.userId = user._id;
    req.session.userName = user.name;

    res.redirect("/dashboard");
  } catch (err) {
    res.render("login", { error: "Login failed" });
  }
});
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.session.userName });
});
app.get("/users", isAuthenticated, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.render("userss", { users, currentUser: req.session.userName });
  } catch (err) {
    res.status(500).send("Error fetching users ");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
