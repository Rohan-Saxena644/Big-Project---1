const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.get("/getcookies",(req,res)=>{
    res.cookie("great" , "hello");
    res.cookie("madeIn" , "India");
    res.send("sent you some cookies!");
});

app.get("/" , (req,res)=>{
    console.dir(req.cookies);
    res.send("Hi i am root");
});

app.use("/users",users);
app.use("/posts",posts);

app.listen(3000,()=>{
    console.log("server is listening to 3000");
});