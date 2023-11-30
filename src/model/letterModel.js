import mongoose from "mongoose";

const letterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  isSubscribed: {
    type: Boolean,
    default: true,
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

export default mongoose.model("letter", letterSchema);
