const bcrypt = require("bcrypt");
const connectDB = require("./db");
async function createUser({ name, email, password }) {
  const db = await connectDB();
  const hashedPassword = await bcrypt.hash(password, 10);
  return db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    status: "active" 
  });
}
async function findUserByEmail(email) {
  const db = await connectDB();
  return db.collection("users").findOne({ email });
}
async function getAllUsers() {
  const db = await connectDB();
  return db.collection("users").find({}, { projection: { password: 0 } }).toArray();
}
module.exports = { createUser, findUserByEmail, getAllUsers };
