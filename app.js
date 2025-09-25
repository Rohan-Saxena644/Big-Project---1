const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

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
app.use(express.static(path.join(__dirname,"public")));

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
app.post("/listings", wrapAsync (async (req,res,next)=>{
    // let {title,description,image,price,country,location} = req.body;
    // let listing = req.body.listing;
    // console.log(listing);
        // if(!req.body.listing){
        //     throw new ExpressError(400,"Send valid data for listing");
        // }

        let result = listingSchema.validate(req.body);
        console.log(result);

        if(result.error){
            throw new ExpressError(400,result.error);
        }

        const newListing = new Listing(req.body.listing);
        // if(!newListing.title){
        //     throw new ExpressError(400,"Title is missing");
        // }

        // if(!newListing.description){
        //     throw new ExpressError(400,"Description is missing");
        // }

        // if(!newListing.location){
        //     throw new ExpressError(400,"Location is missing");
        // }
        await newListing.save();
        res.redirect("/listings");
} ));

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id) ;
    res.render("listings/edit.ejs",{listing}) ;
})


//UPDATE ROUTE
app.put("/listings/:id",async(req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing}); //HUMNE de construct kiy hai listing
    res.redirect(`/listings/${id}`);
});                                                       //object ko jo humne name=listing[id]
                                                         //listing[description] naam rakhe the uski wajah se



// DELETE ROUTE
app.delete("/listings/:id", async (req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});                                                         






app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})

//Error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
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
});

