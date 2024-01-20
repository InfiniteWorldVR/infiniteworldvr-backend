import contactModel from "../model/contactModel";
import { tryCatchHandler } from "../helper/tryCatchHandler";
import NotificationModel from "../model/notificationmodel";
import replyModel from "../model/replyModel";
import sendEmail from "../helper/sendMail";

const contactController = {
  createContact: tryCatchHandler(async (req, res) => {
    const { email, name, message } = req.body;
    const newContact = await contactModel.create({
      email,
      message,
      name,
    });

    const notification = NotificationModel.create({
      message: newContact,
    });

    sendEmail(
      email,
      "Reply from Infinite World VR",
      `
      <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Infinite World VR - Inquiry Response</title>
      <body style="font-family: 'Arial', sans-serif; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0;">

      <div style="max-width: 600px; margin: 0 auto; padding: 30px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin-top: 20px;">

    <h1 style="margin-bottom: 20px; color: #000000;">Dear ${name},</h1>

    <p style="margin-bottom: 20px;">Thank you for reaching out to InfiniteWorldVr. We have received your inquiry and appreciate your interest in our services.</p>

    <p style="margin-bottom: 20px;">Our team is reviewing your message, and we will get back to you promptly with the information you need. In the meantime, if you have any urgent matters, please feel free to contact us directly at infiniteworldvr@gmail.com.</p>

    <p style="margin-bottom: 20px;">Thank you for considering InfiniteWorldVr. We look forward to the opportunity to assist you.</p>

    <div style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">

      <p>Best regards,<br>InfiniteWorldVr Team</p>
      
      <div style="margin-top: 20px;">
        <a href="https://twitter.com/infiniteworldvr" style="margin: 0 8px; display: inline-block;" target="_blank">
          <img src="https://www.veeforu.com/wp-content/uploads/2023/07/Twitter-new-cross-mark-Icon-PNG-X-1024x576.jpg" alt="Twitter Icon" width="24" height="24" style="max-width: 100%; height: auto;">
        </a>
        <a href="https://facebook.com/infiniteworldvr" style="margin: 0 8px; display: inline-block;" target="_blank">
          <img src="https://i.pinimg.com/736x/05/0a/65/050a6577c4da2965f8bb78222c579df4.jpg" alt="Facebook Icon" width="24" height="24" style="max-width: 100%; height: auto;">
        </a>
        <a href="https://instagram.com/infiniteworldvr" style="margin: 0 8px; display: inline-block;" target="_blank">
          <img src="https://img.freepik.com/free-vector/instagram-icon_1057-2227.jpg?size=338&ext=jpg&ga=GA1.1.632798143.1705708800&semt=ais" alt="Instagram Icon" width="24" height="24" style="max-width: 100%; height: auto;">
        </a>
      </div>
      <p>Visit us at <a href="http://www.infiniteworldvr.com" target="_blank" style="color: #777;">www.infiniteworldvr.com</a></p>
    </div>
  </div>
</body>
</html>
       `
    );

    return res.status(201).json({
      status: "success",
      message: "Contact created successfully",
      data: {
        contact: newContact,
      },
    });
  }),
  getContacts: tryCatchHandler(async (req, res) => {
    const contacts = await contactModel.find();
    return res.status(200).json({
      status: "success",
      results: contacts.length,
      data: {
        contacts,
      },
    });
  }),
  getContactById: tryCatchHandler(async (req, res) => {
    const contact = await contactModel.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    return res.json({
      status: "success",
      data: {
        contact,
      },
    });
  }),
  replyContact: tryCatchHandler(async (req, res) => {
    const { contactId, content } = req.body;
    const contact = await contactModel.findById(contactId);
    const newReply = new replyModel({
      content,
      contactId,
    });
    const updatedContact = await contactModel.findByIdAndUpdate(
      contactId,
      { reply: newReply._id },
      {
        new: true,
      }
    );

    sendEmail(
      contact.email,
      "Reply from Infinite World VR",
      `
      <body style="font-family: 'Arial', sans-serif; line-height: 1.6; background-color: #f5f5f5; margin: 0; padding: 0;">

      <div style="max-width: 600px; margin: 0 auto; padding: 30px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin-top: 20px;">
    <h1 style="margin-bottom: 20px; color: #333;">Dear ${contact.name},</h1>
    <p  style="margin-bottom: 20px;">Thank you for reaching out to Infinite World Vr. </p>
    <p style="margin-bottom: 20px;"> ${content} </p>
    <div style="margin-top: 20px; text-align: center; font-size: 14px; color: #777;">
      <p>Best regards,<br>InfiniteWorldVr Team</p>
      <div style="margin-top: 20px;">
        <a href="https://twitter.com/infiniteworldvr" style="margin: 0 8px; display: inline-block;" target="_blank">
          <img src="https://www.veeforu.com/wp-content/uploads/2023/07/Twitter-new-cross-mark-Icon-PNG-X-1024x576.jpg" alt="Twitter Icon" width="24" height="24" style="max-width: 100%; height: auto;">
        </a>
        <a href="https://facebook.com/infiniteworldvr" style="margin: 0 8px; display: inline-block;" target="_blank">
          <img src="https://i.pinimg.com/736x/05/0a/65/050a6577c4da2965f8bb78222c579df4.jpg" alt="Facebook Icon" width="24" height="24" style="max-width: 100%; height: auto;">
        </a>
        <a href="https://instagram.com/infiniteworldvr" style="margin: 0 8px; display: inline-block;" target="_blank">
          <img src="https://img.freepik.com/free-vector/instagram-icon_1057-2227.jpg?size=338&ext=jpg&ga=GA1.1.632798143.1705708800&semt=ais" alt="Instagram Icon" width="24" height="24" style="max-width: 100%; height: auto;">
        </a>
      </div>
      <p>Visit us at <a href="http://www.infiniteworldvr.com" target="_blank" style="color: #777;">www.infiniteworldvr.com</a></p>
    </div>
  `
    );

    const savedReply = await newReply.save();
    res.status(200).json({
      message: "Reply submitted successfully",
      reply: savedReply,
      updatedContact,
    });
  }),
  updateContact: tryCatchHandler(async (req, res) => {
    let updatedContact;
    updatedContact = await contactModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
      }
    );
    return res.json({
      status: "success",
      message: "Contact updated successfully",
      data: {
        contact: updatedContact,
      },
    });
  }),
  deleteContact: tryCatchHandler(async (req, res) => {
    const contact = await contactModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    );
    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }
    return res.json({
      status: "success",
      message: "Contact deleted successfully",
    });
  }),

  deleteAll: tryCatchHandler(async (req, res) => {
    await contactModel.deleteMany({});
    res.status(200).json({
      status: "success",
      message: "contact deleted successfully",
    });
  }),
};

export default contactController;
