import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});
const sendEmail = async (to, subject, text) => {
  try {
const mailOptions = {
  from: "Infinite World VR <info@infiniteworldvr.com>",
  to: to,
  subject: subject,
  html: text,
  attachments: [
    {
      filename: "InfiniteWorldVr.png", // Replace with your logo filename
      path: "https://res.cloudinary.com/nrob/image/upload/v1699701889/tip%20top%20consultancy/infinityworldvr/bkengf5vkx69uchkquxd.jpg", // Replace with the actual path to your logo
      cid: "InfiniteWorldVr@logo", // Use a unique CID for each attachment
    },
  ],
  // Add any additional email options as needed
};

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export default sendEmail;
