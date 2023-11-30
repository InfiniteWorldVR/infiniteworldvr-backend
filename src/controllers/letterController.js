import letterModel from "../model/letterModel";
import { tryCatchHandler } from "../helper/tryCatchHandler";

const letterController = {
  createLetter: tryCatchHandler(async (req, res) => {
    const newLetter = await letterModel.create({
      email: req.body.email,
    });
    return res.json({
      status: "success",
      message: "Letter created successfully",
      data: {
        letter: newLetter,
      },
    });
  }),
  getLetters: tryCatchHandler(async (req, res) => {
    const letters = await letterModel.find();
    return res.json({
      status: "success",
      results: letters.length,
      data: {
        letters,
      },
    });
  }),
  getLetterById: tryCatchHandler(async (req, res) => {
    const letter = await letterModel.findById(req.params.id);
    if (!letter) {
      return res.status(404).json({ error: "Letter not found" });
    }
    return res.json({
      status: "success",
      data: {
        letter,
      },
    });
  }),
  updateLetter: tryCatchHandler(async (req, res) => {
    let updatedLetter;
    updatedLetter = await letterModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      {
        new: true,
      }
    );
    return res.json({
      status: "success",
      message: "Letter updated successfully",
      data: {
        letter: updatedLetter,
      },
    });
  }),
  deleteLetter: tryCatchHandler(async (req, res) => {
    const letter = await letterModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true, isSubscribed: false },
      {
        new: true,
      }
    );
    if (!letter) {
      return res.status(404).json({ error: "Letter not found" });
    }

    return res.json({
      status: "success",
      message: "Letter deleted successfully",
      data: {
        letter,
      },
    });
  }),
};

export default letterController;
