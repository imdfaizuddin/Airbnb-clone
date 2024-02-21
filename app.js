const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const Listing = require("./models/listing.js");
const PORT = 3000;

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

//New
app.get("/listings/new", (req,res)=>{
    res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
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