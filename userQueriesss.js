const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const connectDB = require("./db");

async function createUser({ name, email, password, role = "user" }) {
  const db = await connectDB();
  const hashedPassword = await bcrypt.hash(password, 10);

  return db.collection("users").insertOne({
    name,
    email,
    password: hashedPassword,
    role, 
    status: "active",
  });
}

async function findUserByEmail(email) {
  const db = await connectDB();
  return db.collection("users").findOne({ email });
}
async function getAllUsers() {
  const db = await connectDB();
  return db
    .collection("users")
    .find({}, { projection: { password: 0 } })
    .toArray();
}
async function updateUserStatus(userId, status) {
  const db = await connectDB();
  return db
    .collection("users")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { status } });
}
module.exports = { createUser, findUserByEmail, getAllUsers, updateUserStatus };
