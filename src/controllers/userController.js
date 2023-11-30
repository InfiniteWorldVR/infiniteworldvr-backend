import userModel from "../model/userModel";
import jwt from "jsonwebtoken";
import { tryCatchHandler } from "../helper/tryCatchHandler";
import AppError from "../utils/appError";

const signToken = async (user) => {
  return await jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

const userController = {
  createUser: tryCatchHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      return next(new AppError("User already exists", 409));
    }
    const newUser = await userModel.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });
    const token = await signToken(newUser);
    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user: newUser,
        token,
      },
    });
  }),
  login: tryCatchHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 400));
    }
    const token = await signToken(user);
    return res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .json({
        status: "success",
        message: "User logged in successfully",
        data: {
          user,
          token,
        },
      });
  }),
  getUsers: tryCatchHandler(async (req, res, next) => {
    const users = await userModel.find();
    return res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  }),
  getUserById: tryCatchHandler(async (req, res, next) => {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return next(new AppError(" user not found", 404));
    }
    return res.json({
      status: "success",
      data: {
        user,
      },
    });
  }),
  updateUser: tryCatchHandler(async (req, res) => {
    let updatedUser;
    updatedUser = await userModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
      }
    );
    return res.json({
      status: "success",
      message: "User updated successfully",
      data: {
        user: updatedUser,
      },
    });
  }),
  deleteUser: tryCatchHandler(async (req, res) => {
    const user = await userModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    );
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.json({
      status: "success",
      message: "user deleted successfully",
    });
  }),
  deleteAll: tryCatchHandler(async (req, res) => {
    await userModel.deleteMany({});
    return res.json({
      status: "success",
      message: "Users delete success",
    });
  }),
};

export default userController;
