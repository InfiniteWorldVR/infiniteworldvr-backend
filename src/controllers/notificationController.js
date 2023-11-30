import { tryCatchHandler } from "../helper/tryCatchHandler";
import NotificationModel from "../model/notificationmodel";

const notificationController = {
  getNotification: tryCatchHandler(async (req, res) => {
    const notifications = await NotificationModel.find().sort({
      createdAt: -1,
    });
    return res.status(200).json({
      status: "success",
      results: notifications.length,
      data: {
        notifications,
      },
    });
  }),
  getContactById: tryCatchHandler(async (req, res) => {
    const contact = await NotificationModel.findById(req.params.id);
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
};

export default notificationController;
