const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");
// const cookieParser = require("cookie-parser");

// app.use(cookieParser("secretcode"));

// app.get("/signedcookie" , (req,res)=>{
//     res.cookie("made-in" , "India" , {signed : true});
//     res.send("signed cookie sent");
// });

// app.get("/verify" , (req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// }); // if the output on console is {} {key: false} then the signed cookie has been tempered with

// app.get("/getcookies",(req,res)=>{
//     res.cookie("great" , "hello");
//     res.cookie("madeIn" , "India");
//     res.send("sent you some cookies!");
// });

// app.get("/greet" , (req,res)=>{
//     let {name = "anonymous"} = req.cookies ;
//     res.send(`Hi, ${name}`);
// })

// app.get("/" , (req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hi i am root");
// });

// app.use("/users",users);
// app.use("/posts",posts);


app.use(session({secret: "mysupersecretstring" , resave: false , saveUninitialized: true}));

app.get("/reqcount" , (req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }

    res.send(`You send a request ${req.session.count} times`);
});

app.get("/test" , (req,res)=>{
    res.send("test successful!");
});

app.listen(3000,()=>{
    console.log("server is listening to 3000");
});