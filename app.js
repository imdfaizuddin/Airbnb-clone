const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const Listing = require("./models/listing.js");
const PORT = 3000;
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override')
const ExpresError = require("./utils/ExpressError.js");
const wrapAsync = require("./utils/wrapAsync.js");
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));


const MONGO_URL = 'mongodb://127.0.0.1:27017/airbnb';

main().then(res => {
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('ejs', ejsMate);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

// Index route / all listing route
app.get("/listings", wrapAsync (async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", wrapAsync (async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

// Create Route
app.post("/listings", wrapAsync (async (req, res) => {
    let { title: newTitle, description: newDescription, image: newImage, price: newPrice, country: newCountry, location: newLocation } = req.body;

    const listing = new Listing({
        title: newTitle,
        description: newDescription,
        image: {
            filename: "listingimage",
            url: newImage,
        },
        price: newPrice,
        country: newCountry,
        location: newLocation,
    });
    // console.log(listing);
    if(!listing.title && !listing.price){
        throw new ExpresError(400, "Send valid data for listing");
    }
    await listing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync (async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/edit.ejs", { listing });
}));

// Update Route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { listing } = req.body;
    listing.image.filename = "listingimage";
    console.log(id);
    if(!listing.title && !listing.price){
        throw new ExpresError(400, "Send valid data for listing");
    }
    await Listing.findByIdAndUpdate(id, { ...listing }, { new: true, runValidators: true });
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let deleted = await Listing.findByIdAndDelete(id);
    // console.log(deleted);
    res.redirect("/listings");
}));


app.all("*", (req, res, next) => {
    next(new ExpresError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    // res.status(statusCode).send(message);
    console.log(err)
    res.render("listings/error.ejs", {err});
})
// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample listing was saved");
//     res.send("successful testing");
// });

app.listen(PORT, () => {
    console.log("server is running on port: ", PORT);
})