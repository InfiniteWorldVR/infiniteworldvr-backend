import { Router } from "express";
import express from "express";

import teamController from "../controllers/teamController";
// import upload from "../helper/multer";

const router = Router();

// const app = express();
// app.use(upload.single("image"));

router.get("/", teamController.getTeams);
router.get("/:id", teamController.getTeamById);
router.post("/", teamController.createTeam);
router.put("/:id", teamController.updateTeam);
router.delete("/:id", teamController.deleteTeam);

export default router;
