import Team from "../model/teamModel";
import { tryCatchHandler } from "../helper/tryCatchHandler";
import { uploadToCloud } from "../helper/cloud";

const teamController = {
  createTeam: tryCatchHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }
    const image = await uploadToCloud(req.file, res);
    const newTeam = await Team.create({
      name: req.body.name,
      position: req.body.position,
      image: image.secure_url,
      twitter: req.body.twitter,
      facebook: req.body.facebook,
      instagram: req.body.instagram,
    });
    return res.json({
      status: "success",
      message: "Team created successfully",
      data: {
        team: newTeam,
      },
    });
  }),
  getTeams: tryCatchHandler(async (req, res) => {
    const teams = await Team.find({
      isDeleted: false,
    });
    return res.json({
      status: "success",
      results: teams.length,
      data: {
        teams,
      },
    });
  }),
  getTeamById: tryCatchHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    return res.json({
      status: "success",
      data: {
        team,
      },
    });
  }),
  updateTeam: tryCatchHandler(async (req, res) => {
    const team = await Team.findById(req.params.id);
    let updatedTeam;
    console.log(req.body);
    if (req.file) {
      console.log("image");
      const image = await uploadToCloud(req.file, res);
      updatedTeam = await Team.findByIdAndUpdate(
        req.params.id,
        { ...req.body, image: image.secure_url },
        {
          new: true,
        }
      );
    } else {
      console.log("no image");
      updatedTeam = await Team.findByIdAndUpdate(
        req.params.id,
        { ...req.body, image: team.image },
        {
          new: true,
        }
      );
    }
    return res.json({
      status: "success",
      message: "Team updated successfully",
      data: {
        team: updatedTeam,
      },
    });
  }),
  deleteTeam: tryCatchHandler(async (req, res) => {
    const team = await Team.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      {
        new: true,
      }
    );
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    return res.json({
      status: "success",
      message: "Team deleted successfully",
    });
  }),
};

export default teamController;
