import { Router } from "express";
import contactController from "../controllers/contactController";

const router = Router();

router.get("/", contactController.getContacts);
router.get("/:id", contactController.getContactById);
router.post("/", contactController.createContact);
router.put("/:id", contactController.updateContact);
router.delete("/:id", contactController.deleteContact);
router.post("/reply", contactController.replyContact);
router.delete("/delete/all", contactController.deleteAll);

export default router;
