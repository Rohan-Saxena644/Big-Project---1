const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

// middleware for schema validations
const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//Index Route
router.get("/",async (req,res)=>{
    const allListings = await Listing.find({}) ;
    res.render("listings/index",{allListings}) ;
});

//New Route
router.get("/new" , async (req,res)=>{
    res.render("listings/new");
});

//show route
router.get("/:id", async (req,res)=>{
    let {id} = req.params ;
    const listing = await Listing.findById(id).populate("reviews") ;
    res.render("listings/show",{listing}) ;
});

//Create route
router.post("/",validateListing, wrapAsync (async (req,res,next)=>{
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","New listing created");
        res.redirect("/listings");
} ));

//Edit route
router.get("/:id/edit",async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id) ;
    res.render("listings/edit.ejs",{listing}) ;
});


//UPDATE ROUTE
router.put("/:id", validateListing, async(req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated"); 
    res.redirect(`/listings/${id}`);
});                                                     



// DELETE ROUTE
router.delete("/:id", async (req,res)=>{
    let{id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
});

module.exports = router;