import express from "express";

import blogRoute from "../routes/blogRoute";
import teamRoute from "../routes/teamRoute";
import categoryRoute from "../routes/categoryRoute";
import productRoute from "../routes/productRoute";
import contactRoute from "../routes/contactRoute";
import letterRoute from "../routes/letterRoute";
import userRoute from "../routes/userRoute";
import notificationRoute from "../routes/notificationRoute";
import commentRoute from "../routes/commentRoute";

const appRouter = express();

appRouter.use("/blogs", blogRoute);
appRouter.use("/teams", teamRoute);
appRouter.use("/category", categoryRoute);
appRouter.use("/products", productRoute);
appRouter.use("/contacts", contactRoute);
appRouter.use("/notifications", notificationRoute);
appRouter.use("/letters", letterRoute);
appRouter.use("/letters", letterRoute);
appRouter.use("/users", userRoute);
appRouter.use("/comments", commentRoute);

export default appRouter;
