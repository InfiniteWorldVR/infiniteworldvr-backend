import express from "express";

import notificationController from "../controllers/notificationController";

const router = express.Router();

router.route("/").get(notificationController.getNotification);



// router
//   .route("/:id")
//   .put(notificationController.updateCategory)
//   .delete(notificationController.deleteCategory)
//   .get(notificationController.getCategoryById);

export default router;
