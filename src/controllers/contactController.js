import contactModel from "../model/contactModel";
import { tryCatchHandler } from "../helper/tryCatchHandler";
import NotificationModel from "../model/notificationmodel";
import replyModel from "../model/replyModel";

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
    const { contactId, replyContent } = req.body;

    const newReply = new replyModel({
      content: replyContent,
      contactId,
    });

    const savedReply = await newReply.save();

    // Update the contact with the reply reference
    const updatedContact = await contactModel.findByIdAndUpdate(
      contactId,
      { $push: { replies: savedReply._id } },
      { new: true }
    );

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
