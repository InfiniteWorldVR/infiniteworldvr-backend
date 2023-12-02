import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import blogRoute from "./routes/blogRoute";
import productRoute from "./routes/productRoute";
import teamRoute from "./routes/teamRoute";
import letterRoute from "./routes/letterRoute";
import categoryRoute from "./routes/categoryRoute";
import contactRoute from "./routes/contactRoute";
import notificationRoute from "./routes/notificationRoute";
import userRoute from "./routes/userRoute";
import upload from "./helper/multer";
import { handleInternalServerError } from "./controllers/errorController";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({}));
app.use(cors());
app.use(upload.single("image"));

// Define your routes here
app.get("/", (req, res) => {
  res.status(200).json({
    message: " Welcome to infinite world VR api",
  });
});
app.use("/blogs", blogRoute);
app.use("/teams", teamRoute);
app.use("/category", categoryRoute);
app.use("/products", productRoute);
app.use("/contacts", contactRoute);
app.use("/notifications", notificationRoute);
app.use("/letters", letterRoute);
app.use("/users", userRoute);

app.use(handleInternalServerError);

export default app;
