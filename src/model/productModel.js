import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  category: {
    type: String,
    default: "clothing",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: Array,
    default: [
      "https://res.cloudinary.com/nrob/image/upload/v1697872188/mphc27iavdvqdxpwkr0p.png",
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
