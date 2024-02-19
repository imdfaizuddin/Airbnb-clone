const express = require("express");
const app = express();
const mongoose = require("mongoose");

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

app.listen(PORT , ()=>{
    console.log("server is running on port: ", PORT);
})