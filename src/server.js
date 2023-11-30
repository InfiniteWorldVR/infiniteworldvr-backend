import express from "express";
import mongoose from "mongoose";
import app from "./app";

const port = 4000; // Change the port number as per your requirement

async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}

connectToMongoDB();

app.listen(port, () => {
  console.log(`Server is open and running ${port}`);
});
