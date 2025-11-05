const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");

//Index Route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new" , isLoggedIn , wrapAsync(listingController.renderNewForm));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//Create route
router.post("/", isLoggedIn ,validateListing, wrapAsync(listingController.createListing));

//Edit route
router.get("/:id/edit", isLoggedIn , isOwner , wrapAsync(listingController.renderEditForm));


//UPDATE ROUTE
router.put("/:id", isLoggedIn , isOwner , validateListing , wrapAsync(listingController.updateListing));                                                     



// DELETE ROUTE
router.delete("/:id", isLoggedIn , isOwner , wrapAsync(listingController.destroyListing));

module.exports = router;