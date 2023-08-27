//jshint esversion:6
import 'dotenv/config'
import  express from "express";
import  ejs from "ejs"
import  bodyParser from "body-parser"
import mongoose from "mongoose"
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';


mongoose.connect("mongodb://127.0.0.1:27017/userDB",).then(
  () => { console.log("connected")},
  err => { console.log(err.message) }
);






const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
extended: true
}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
  }))

app.use(passport.initialize())
app.use(passport.session());


const userSchema = new mongoose.Schema({
    Email:String,
    Password:String,
})
userSchema.plugin(passportLocalMongoose)
const userModel = new mongoose.model("users",userSchema)
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser (userModel.deserializeUser());


app.get("/", function(req, res){
res.render("home");
});
app.get("/login", function(req, res) {
res.render("login");
});
app.post("/login", async function(req, res) {
    const user = new userModel({
        username: req.body.username,
        password: req.body.password
        });
        req. login(user, function(err) {
        if (err) {
        console.log(err);
        } else {
        passport.authenticate("local") (req, res, function(){
        res.redirect("/secrets");
        });
        }
        });
    });
app.get("/register",(req,res)=>{
    res.render("register")
})
app.post("/register",(req,res)=>{
    userModel.register({username: req.body.username}, req.body.password, function(err, user) {
        if (err) {
        console.log(err);
        res.redirect("/register");
        } else {
        passport.authenticate("local") (req, res, function () {
        res.redirect("/secrets");
        });
        }
        });
})
app.get("/secrets",(req,res)=>{
    if(req.isAuthenticated()){
        res.render("secrets")
    }else
    {
        res.redirect("/login")
    }
    
})
app.get("/submit",(req,res)=>{
    res.render("submit")
})
app.get("/logout",(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
})

app.listen(3000, ()=>{
    console.log("Connected to server")
})