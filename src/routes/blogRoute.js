import express from "express";
import blogController from "../controllers/blogController";
import upload from "../helper/multer";
import auth from "../middleware/auth";

const router = express.Router();

const app = express();

app.use(upload.single("image"));

router.post("/", auth, blogController.createBlog);

router.get("/", blogController.getBlogs);

router.get("/:id", blogController.getBlogById);

router.put("/:id", auth, blogController.updateBlog);

router.delete("/:id", auth, blogController.deleteBlog);

export default router;
