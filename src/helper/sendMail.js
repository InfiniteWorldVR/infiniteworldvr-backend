import nodemailer from "nodemailer";

// Create a nodemailer transporter using your SMTP server details
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "contact.infiniteworldvr@gmail.com",
    pass: "uivt ysoi zfhr eick",
  },
});

// Reusable function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    // Define the email content
    const mailOptions = {
      from: "contact@infiniteworldvr.com",
      to,
      subject,
      html: text,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
export default sendEmail;
