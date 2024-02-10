import { uploadToCloud } from "../helper/cloud";
import sendEmail from "../helper/sendMail";
import { tryCatchHandler } from "../helper/tryCatchHandler";
import blogModel from "../model/blogModel";
import letterModel from "../model/letterModel";
import likesSchema from "../model/likesSchema";

const blogController = {
  createBlog: tryCatchHandler(async (req, res) => {
    const subscribedEmails = await letterModel.find();
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
    //    link on webiste look like this https://infiniteworldvr.com/blog/65a6df0193e30efb9d8a021c

    for (let index = 0; index < subscribedEmails.length; index++) {
      sendEmail(
        subscribedEmails[index].email,
        "New post from  Infinite World VR",
        `
      <body style="color: black; font-family: 'Arial', sans-serif; text-align: center;">

      <h1 style="color: #000; font-size: 28px; margin-bottom: 10px;">
      Exciting News! 🚀 New Post Alert at Infinite World VR!
      </h1>
      <p style="font-size: 18px; margin-bottom: 15px;">
    Discover the latest on our website – a new post awaits your exploration.
  </p>
  <div style="width: 100%; padding: 20px;">
    <img src="${newBlog.image}" alt="blog image" style="width: 100%; max-width: 400px; height: auto; border-radius: 8px; margin-bottom: 15px;">
    <p style="font-size: 20px; margin-bottom: 15px;">
      <strong>${newBlog.title}</strong><br />
      ${newBlog.summary}
    </p>
    <a href="https://infiniteworldvr.com/blog/${newBlog._id}" target="_blank" style="text-decoration: none; color: #000;">
      <button style="background-color: #000; color: #fff; padding: 10px; border: none; border-radius: 5px; cursor: pointer;">
        Read more
      </button>
    </a>
  </div>
  <p style="font-size: 16px;">
    Visit us at <a href="http://www.infiniteworldvr.com" target="_blank" style="color: #777; text-decoration: none;">www.infiniteworldvr.com</a>
  </p>
</body>
      `
      );
    }
    return res.status(201).json({
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
      .populate("user")
      .populate("comments");

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
        { ...req.body, image: image.secure_url, user: req.user._id },
        {
          new: true,
        }
      );
    } else {
      updatedBlog = await blogModel
        .findByIdAndUpdate(
          req.params.id,
          { ...req.body, image: post.image, user: req.user._id },
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
  addLikeToPost: tryCatchHandler(async (req, res) => {
    const blog = await blogModel.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    const getLike = await likesSchema.findOne({
      user: req.body.user,
      post: req.params.id,
    });
    if (getLike) {
      await likesSchema.findByIdAndDelete(getLike._id);
      blog.likes.pull(getLike._id); //pull is used to remove the id from the array

      await blog.save();
      return res.status(200).json({
        status: "success",
        message: "Like deleted successfully",
      });
    }
    const like = await likesSchema.create({
      user: req.body.user,
      post: req.params.id,
    });

    blog.likes.push(like._id);
    await blog.save();
    return res.status(201).json({
      status: "success",
      message: "Like added successfully",
      data: {
        like,
      },
    });
  }),
  getLikes: tryCatchHandler(async (req, res) => {
    const likes = await likesSchema.find({
      post: req.params.id,
    });
    return res.status(200).json({
      status: "success",
      results: likes.length,
      data: {
        likes,
      },
    });
  }),
  testEmail: tryCatchHandler(async (req, res) => {
    sendEmail("robertn@infiniteworldvr.com", "test", "test");
    return res.status(200).json({
      status: "success",
      message: "Email sent",
    });
  }),
};

export default blogController;
