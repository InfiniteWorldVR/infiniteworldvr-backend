import userModel from "../model/userModel";
import jwt from "jsonwebtoken";
import { tryCatchHandler } from "../helper/tryCatchHandler";
import crypto from "crypto";
import AppError from "../utils/appError";
import sendEmail from "../helper/sendMail";

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
    const user = await userModel.findByIdAndDelete(req.params.id);

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
  forgotPassword: tryCatchHandler(async (req, res, next) => {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Password Reset</title>
       <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
     .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #333333;
    }
    p {
      color: #555555;
    }
    .cta-button {
      display: inline-block;
      padding: 10px 20px;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      text-decoration: none;
      background-color: #3498db;
      color: #ffffff;
      border-radius: 4px;
    }
    .cta-button:hover {
      background-color: #217dbb;
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      color: #888888;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Password Reset</h1>
    <p>You've requested a password reset for your Infinite World VR account. Click the button below to reset your password:</p>
    <a href="${resetURL}" class="cta-button">Reset My Password</a>
    <p>If you didn't request this password reset, please ignore this email. Your account is still secure.</p>
    <div class="footer">
      <p>Infinite World VR Team</p>
    </div>
  </div>
</body>
</html>
`;

    sendEmail(
      user.email,
      "Password Reset Request for Your Infinite World VR Account",
      message
    );

    return res.json({
      status: "success",
      message: "Token sent to email",
    });
  }),

  resetPassword: tryCatchHandler(async (req, res, next) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const user = await userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    console.log(user);
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    const token = await signToken(user);
    console.log(token);

    return res.json({
      status: "success",
      message: "Password reset successful",
      token,
    });
  }),
};

export default userController;
