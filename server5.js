const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { createUser, findUserByEmail } = require("./userQueries");
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({secret:"supersecretkey",resave:false,saveUninitialized:false,cokkie:{secure:false}}))
function isAuthenticated(req,res,next){
    if(req.session.userId){
        return next();

    }
    res.status(401).json({error:"unauthorized"})
}
app.post('/register',async(req,res)=>{
    try{
        const { name, email, password } = req.body;
        const existingUser=await findUserByEmail(email)
  if(existingUser){
     return res.status(400).json({ error: "User already exists " });
  }
      const result = await createUser({ name, email, password });
    res.status(201).json({ message: "User registered ", userId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Server error ", details: err.message });
  }
})

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ error: "User not found " });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password " });
    req.session.userId = user._id;
    res.json({ message: `Welcome, ${user.name}  You are logged in.` });
  } catch (err) {
    res.status(500).json({ error: "Server error ", details: err.message });
  }
});
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.json({ message: "This is your dashboard ", userId: req.session.userId });
});
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: "Could not log out " });
    res.json({ message: "Logged out successfully " });
  });
});
app.listen(PORT, () => console.log(` Server running at http://localhost:${PORT}`));