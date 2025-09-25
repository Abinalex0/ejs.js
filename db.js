const {MongoClient}=require('mongodb')
const uri="mongodb://127.0.0.1:27017";
const client=new MongoClient(uri);
async function connectDB(){
    if(!client.topology?.isConnected()){
        await client.connect();
        console.log("connected");
    }
    return client.db("myDatabase")
}
module.exports=connectDB