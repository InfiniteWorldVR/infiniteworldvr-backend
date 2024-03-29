import express from "express";

import commentController from "../controllers/commentController";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/", commentController.getComments);
router.get("/:id", commentController.getCommentById);
router.post("/add/:id", auth, commentController.addCommentPost);
router.put("/:id", auth, commentController.updateCommentPost);
router.delete("/:id", auth, commentController.deleteCommentPost);
router.delete("/delete/all", commentController.deleteAllComments);

export default router;
