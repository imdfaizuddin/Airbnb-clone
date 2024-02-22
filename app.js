const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const Listing = require("./models/listing.js");
const PORT = 3000;
const methodOverride = require('method-override')
app.use(methodOverride('_method'));


const MONGO_URL ='mongodb://127.0.0.1:27017/airbnb';

main().then(res=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("working");
});

// Index route / all listing route
app.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//New Route
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

// Create Route
app.post("/listings", (req,res)=>{
    let {title: newTitle, description: newDescription, image: newImage, price: newPrice, country: newCountry, location: newLocation} = req.body;
    
    const listing = new Listing ({
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
    listing.save().then(()=>{
        console.log("new listing saved.");
    }).catch(err=>{console.log("Error Occured: ",err)});
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    // console.log(listing);
    res.render("listings/edit.ejs", {listing});
});

// Update Route
app.put("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    let{listing} = req.body;
    listing.image.filename ="listingimage";
    // console.log(id);
    await Listing.findByIdAndUpdate(id, {...listing}, {new: true}).then((result)=>{
        // console.log("listing is updated: ", result);
    }).catch(err=>{console.log("Error occured: ",err)});
    res.redirect(`/listings/${id}`);
});

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

app.listen(PORT , ()=>{
    console.log("server is running on port: ", PORT);
})