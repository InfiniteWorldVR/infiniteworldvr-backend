import express from "express";

import categoryController from "../controllers/categoryController";

const router = express.Router();

router
  .route("/")
  .get(categoryController.getCategories)
  .post(categoryController.createCategory);

router
  .route("/:id")
  .put(categoryController.updateCategory)
  .delete(categoryController.deleteCategory)
  .get(categoryController.getCategoryById);

export default router;
