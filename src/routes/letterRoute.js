import { Router } from "express";
import letterController from "../controllers/letterController";

const router = Router();

router.get("/", letterController.getLetters);
router.get("/:id", letterController.getLetterById);
router.post("/", letterController.createLetter);
router.put("/:id", letterController.updateLetter);
router.delete("/:id", letterController.deleteLetter);

export default router;
