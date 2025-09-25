const bcrypt=require('bcrypt')
const connectDB=require('./db')
async function createUser({name,email,password}){
    const db=await connectDB();
    const hashedPassword=await bcrypt.hash(password,10);
    return db.collection("users").insertOne({
        name,email,password:hashedPassword
    })
}

async function findUserByEmail(email) {
  const db = await connectDB();
  return db.collection("users").findOne({ email });
}

module.exports = { createUser, findUserByEmail };