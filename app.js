const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Listing = require("./models/listing.js");
const PORT = 3000;

const MONGO_URL ='mongodb://127.0.0.1:27017/airbnb';

main().then(res=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
  }

app.get("/", (req,res)=>{
    res.send("working");
});

app.get("/testListing", async (req,res)=>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By the beach",
        price: 1200,
        location: "Calangute, Goa",
        country: "India",
    });

    await sampleListing.save();
    console.log("sample listing was saved");
    res.send("successful testing");
});

app.listen(PORT , ()=>{
    console.log("server is running on port: ", PORT);
})