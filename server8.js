const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const {
  createUser,
  findUserByEmail,
  getAllUsers,
  updateUserStatus,
} = require("./userQueriesss");
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
app.use(flash());
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.session.userRole === "admin") return next();
  res.status(403).send("Forbidden: Admins only ");
}
app.get("/", (req, res) => res.redirect("/login"));
app.get("/register", (req, res) => res.render("register", { error: null }));
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser)
      return res.render("register", { error: "Email already registered" });

    await createUser({ name, email, password, role: "user" });
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
    req.session.userRole = user.role;

    res.redirect("/dashboard");
  } catch (err) {
    res.render("login", { error: "Login failed" });
  }
});
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", {
    user: req.session.userName,
    role: req.session.userRole,
  });
});
app.get("/users", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    const message = req.flash("message");
    res.render("usersss", {
      users,
      currentUser: req.session.userName,
      message,
    });
  } catch (err) {
    res.status(500).send("Error fetching users ");
  }
});
app.post("/users/:id/enable", isAuthenticated, isAdmin, async (req, res) => {
  const userId = req.params.id; 
  try {
    await updateUserStatus(userId, "active");
    req.flash("message", "User enabled successfully");
    res.redirect("/users");
  } catch (err) {
    console.error("Enable error:", err);
    req.flash("message", " Failed to enable user");
    res.redirect("/users");
  }
});
app.post("/users/:id/disable", isAuthenticated, isAdmin, async (req, res) => {
  const userId = req.params.id; 
  if (userId === req.session.userId) {
    req.flash("message", "⚠️ You cannot disable your own account");
    return res.redirect("/users");
  }
  try {
    await updateUserStatus(userId, "inactive");
    req.flash("message", " User disabled successfully");
    res.redirect("/users");
  } catch (err) {
    console.error("Disable error:", err);
    req.flash("message", " Failed to disable user");
    res.redirect("/users");
  }
});
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
