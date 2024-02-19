const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = 3000;

app.get("/", (req,res)=>{
    res.send("working");
});

app.listen(PORT , ()=>{
    console.log("server is running on port: ", PORT);
})