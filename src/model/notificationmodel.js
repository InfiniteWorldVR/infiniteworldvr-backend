import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  message: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["query", "product", "blog"],
    default: "query", // You can extend this based on your needs
  },
  status: {
    type: String,
    enum: ["unread", "read"],
    default: "unread",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", notificationSchema);
