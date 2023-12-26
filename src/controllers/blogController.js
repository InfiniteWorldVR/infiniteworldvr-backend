tryCatchHandler;
import { populate } from "dotenv";
import { uploadToCloud } from "../helper/cloud";
import { tryCatchHandler } from "../helper/tryCatchHandler";
import blogModel from "../model/blogModel";

const blogController = {
  createBlog: tryCatchHandler(async (req, res) => {
    console.log(req.user);
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }
    const image = await uploadToCloud(req.file, res);
    const newBlog = await blogModel.create({
      title: req.body.title,
      summary: req.body.summary,
      image: image.secure_url,
      content: req.body.content,
      category: req.body.category,
      user: req.user._id,
    });
    res.status(201).json({
      status: "success",
      message: "Blog created successfully",
      data: {
        blog: newBlog,
      },
    });
  }),

  getBlogs: tryCatchHandler(async (req, res) => {
    const blogs = await blogModel
      .find({
        isDeleted: false,
      })
      .sort({ createdAt: -1 })
      .populate("user");
    return res.status(200).json({
      status: "success",
      results: blogs.length,
      data: {
        blogs,
      },
    });
  }),

  getBlogById: tryCatchHandler(async (req, res) => {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.status(200).json({
      status: "success",
      data: {
        blog,
      },
    });
  }),

  updateBlog: tryCatchHandler(async (req, res) => {
    const post = await blogModel.findById(req.params.id);
    console.log(req.user._id, post.user, "user");

    let updatedBlog;
    if (req.file) {
      const image = await uploadToCloud(req.file, res);
      updatedBlog = await blogModel.findByIdAndUpdate(
        req.params.id,
        { ...req.body, image: image.secure_url },
        {
          new: true,
        }
      );
    } else {
      updatedBlog = await blogModel
        .findByIdAndUpdate(
          req.params.id,
          { ...req.body, image: post.image },
          {
            new: true,
          }
        )
        .populate("user");
    }
    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.status(200).json({ message: "Blog updated successfully" });
  }),
  deleteBlog: tryCatchHandler(async (req, res) => {
    const deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    return res.json({ message: "Blog deleted successfully" });
  }),
};

export default blogController;
