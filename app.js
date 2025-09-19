const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ;

main()
    .then(()=>{
        console.log("Connected to db") ;
    }).catch((err)=>{
        console.log(err) ;
    }) ;

async function main(){
    await mongoose.connect(MONGO_URL) ;
}

app.set("view engine","ejs") ;
app.set("views", path.join(__dirname,"views")) ;
app.use(express.urlencoded({extended: true})) ;
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hello,I am root") ;
})

//Index Route
app.get("/listings",async (req,res)=>{
    const allListings = await Listing.find({}) ;
    res.render("listings/index",{allListings}) ;
})

//New Route
app.get("/listings/new" , async (req,res)=>{
    res.render("listings/new");
})

//show route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params ;
    const listing = await Listing.findById(id) ;
    res.render("listings/show",{listing}) ;
})

//Create route
app.post("/listings", async (req,res)=>{
    // let {title,description,image,price,country,location} = req.body;
    // let listing = req.body.listing;
    // console.log(listing);
    try{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    }catch(err){
        next(err);
    }
} )

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id) ;
    res.render("listings/edit.ejs",{listing}) ;
})


//UPDATE ROUTE
app.put("/listings/:id",async(req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); //HUMNE de construct kiy hai listing
    res.redirect(`/listings/${id}`);
})                                                       //object ko jo humne name=listing[id]
                                                         //listing[description] naam rakhe the uski wajah se



// DELETE ROUTE
app.delete("/listings/:id", async (req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})                                                         


//Error handling middleware
app.use((err,req,res,next)=>{
    res.send("Something went wrong");
});




// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the Beach",
//         price: 1200,
//         location: "Calangute,Goa",
//         country: "India",
//     })

//     await sampleListing.save() ;
//     console.log("Sample was saved") ;
//     res.send("Successful Testing");
// }) ;

app.listen(8080,()=>{
    console.log("server is listening to port 8080") ;
})

