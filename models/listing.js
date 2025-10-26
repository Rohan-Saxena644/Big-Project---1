const mongoose = require("mongoose") ;
const Schema = mongoose.Schema ;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String ,
        required: true ,
    },
    description: String,
    image:String,
    //     // default:
    //     //     "https://i.pinimg.com/736x/b8/6b/17/b86b170e78a07c37e8001350c92123bb.jpg",
    //     // set: (v)=>
    //     //     v==="" 
    //     //     ? "https://i.pinimg.com/736x/b8/6b/17/b86b170e78a07c37e8001350c92123bb.jpg"
    //     //     : v ,

    
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }

}) ;

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: { $in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema) ;
module.exports = Listing ;