const express= require('express')
const app=express()
const PORT=process.env.PORT || 3000;
app.set('view engine','ejs')
app.set("views","./views")
app.use(express.json());


app.get('/',(req,res)=>{

    res.render("index", { title: "Home Page", message: "Hello from EJS 👋" })});
app.get('/users',(req,res)=>{
    const users=[{name:"eldo"},{name:"alu"},{name:"bobs"}]
    res.render("users",{users})
})
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));