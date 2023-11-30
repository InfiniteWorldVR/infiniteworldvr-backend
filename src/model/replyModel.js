import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  content: String,
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Contact",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Reply", replySchema);
