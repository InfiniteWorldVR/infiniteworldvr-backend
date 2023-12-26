import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blog",
    unique: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("comment", commentSchema);
