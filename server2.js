const express=require('express')
const app=express()
const PORT=process.env.PORT || 3000
app.set('view engine','ejs')
app.set('views','./views')

app.use(express.urlencoded({extended:true}));
app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/login',(req,res)=>{
    console.log(req.body)
    const {email,password}=req.body
    res.send(`users email id is${email} and password is ${password}`)
})

app.post('/register',(req,res)=>{
    const {name,email,password}=req.body
res.send(`user name is ${name} email is ${email} passsword is ${password}`)
})

app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`)
})
