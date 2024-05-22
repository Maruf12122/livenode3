const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const contactmodul = require("./model/contsc");
const usermodul = require("./model/user");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 3000;

const token = "blog$maruf$mursalin"

app.set("view engine", "ejs");
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/account", islogin , async (req, res) => {
  let user = await usermodul.findOne({email: req.user.email})
  res.render("a-i",{user});

});
app.get("/logut", (req, res) => {
  res.cookie("token","");
  res.redirect("/login")
});
app.post("/contact", async (req, res) => {
  let { email, subject, message } = req.body;
  await contactmodul.create({
    email,
    subject,
    message,
  });
  res.redirect("/");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login/create",async (req,res)=>{
  let {email,password} = req.body
  const userfind = await usermodul.findOne({email})
  
  if(!userfind){
    res.send("ssssssssssssss")
  }
  else{
    bcrypt.compare(password,userfind.password,(err, result)=>{
      if(result){
        const jwtuser = jwt.sign({email,userid:userfind._id},token)
        res.cookie("token",jwtuser)
        res.redirect("/account")
      }
      else{
        res.send("password is ron")
      }
    })
  }
})
app.get("/sing-up", (req, res) => {
  res.render("sing-up");
});
app.post("/sing-up/create", async (req,res)=>{
    let {username,email,password} = req.body
    const user = await usermodul.findOne({email})
    if(user)res.send("ssssssssssssss")
    else{bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(password,salt,async (err,hash)=>{
          const user = await usermodul.create({
              username,
              email,
              password:hash
          })
          const jwtuser = jwt.sign({email,userid:user._id},token)
          res.cookie("token",jwtuser)
          res.redirect("/login")
      })
  })}
    
})


function islogin (req,res,next){
  if(req.cookies.token === ""){
    res.redirect("/login")
  }
  else{
    const userjwt = jwt.verify(req.cookies.token,token)
    req.user = userjwt;
    next();
  }
}



app.listen(port);
