import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  user: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: "blog", required: true },
});

export default mongoose.model("Like", likeSchema);
