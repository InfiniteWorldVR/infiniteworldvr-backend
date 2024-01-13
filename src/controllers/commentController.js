import { tryCatchHandler } from "../helper/tryCatchHandler";
import blogModel from "../model/blogModel";
import commentModel from "../model/commentModel";

const commentController = {
  getComments: tryCatchHandler(async (req, res) => {
    const comments = await commentModel.find({
      isDeleted: false,
    });
    return res.status(200).json({
      status: "success",
      results: comments.length,
      data: {
        comments,
      },
    });
  }),
  getCommentById: tryCatchHandler(async (req, res) => {
    const comment = await commentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    return res.status(200).json({
      status: "success",
      data: {
        comment,
      },
    });
  }),
  addCommentPost: tryCatchHandler(async (req, res) => {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    const newComment = await commentModel.create({
      ...req.body,
      blog: req.params.id,
      email: req.user.email,
      name: req.user.name,
    });

    blog.comments.push(newComment._id);
    await blog.save();

    return res.status(201).json({
      status: "success",
      message: "Comment created successfully",
      data: {
        comment: newComment,
      },
    });
  }),

  updateCommentPost: tryCatchHandler(async (req, res) => {
    const comment = await commentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to update this comment" });
    }
    const updatedComment = await commentModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
      }
    );
    return res.status(200).json({
      status: "success",
      message: "Comment updated successfully",
      data: {
        comment: updatedComment,
      },
    });
  }),
  deleteCommentPost: tryCatchHandler(async (req, res) => {
    const comment = await commentModel.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this comment" });
    }
    await comment.findByIdAndUpdate(req.params.id, { isDeleted: true });
    return res.status(200).json({
      status: "success",
      message: "Comment deleted successfully",
    });
  }),

  deleteAllComments: tryCatchHandler(async (req, res) => {
    await commentModel.deleteMany({});
    return res.status(200).json({
      status: "success",
      message: "All comments deleted successfully",
    });
  }),
};

export default commentController;
