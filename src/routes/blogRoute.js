import express from "express";
import blogController from "../controllers/blogController";
import upload from "../helper/multer";

const router = express.Router();

const app = express();

app.use(upload.single("image"));


router.post("/", blogController.createBlog);

router.get("/", blogController.getBlogs);

router.get("/:id", blogController.getBlogById);

router.put("/:id", blogController.updateBlog);

router.delete("/:id", blogController.deleteBlog);

export default router;
