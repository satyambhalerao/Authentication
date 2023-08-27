//jshint esversion:6
import 'dotenv/config'
import  express from "express";
import  ejs from "ejs"
import  bodyParser from "body-parser"
import mongoose from "mongoose"
import md5 from 'md5'




mongoose.connect("mongodb://127.0.0.1:27017/userDB",).then(
  () => { console.log("connected")},
  err => { console.log(err.message) }
);

const userSchema = new mongoose.Schema({
    Email:String,
    Password:String,
})
const userModel = new mongoose.model("users",userSchema)




const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
extended: true
}));
app.get("/", function(req, res){
res.render("home");
});
app.get("/login", function(req, res) {
res.render("login");
});
app.post("/login", async function(req, res) {
    const username = req.body.username
    const password = md5(req.body.password)
    const user = await userModel.findOne({Email: username})
        if(user.Password === password)
        {     
            console.log("Success")
            res.render("secrets");
        }
        else
        {
            console.log("UnSuccess")
            res.render("login");
        }
    });
app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register",(req,res)=>{
    const user = new  userModel(
        {Email:req.body.username,
        Password:md5(req.body.password)
        }
    )
    user.save()
    res.redirect("/login")
})
app.get("/secrets",(req,res)=>{
    res.render("secrets")
})
app.get("/submit",(req,res)=>{
    res.render("submit")
})
app.get("/logout",(req,res)=>{
    res.redirect("/")
})

app.listen(3000, ()=>{
    console.log("Connected to server")
})