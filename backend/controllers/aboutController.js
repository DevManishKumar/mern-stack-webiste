const aboutController = require("express").Router();
const About = require("../models/About");
const verifyToken = require("../middlewares/verifyToken");

aboutController.get("/getAll", async (req, res) => {
  try {
    const abouts = await About.find({}).populate("userId", "-password");
    return res.status(200).json(abouts);
  } catch (error) {
    return res.status(500).json(error);
  }
});

aboutController.get("/find/:id", async (req, res) => {
  try {
    const about = await About.findById(req.params.id).populate(
      "userId",
      "-password"
    );
    about.views += 1;
    await about.save();
    return res.status(200).json(about);
  } catch (error) {
    return res.status(500).json(error);
  }
});

aboutController.post("/", verifyToken, async (req, res) => {
  try {
    const about = await About.create({ ...req.body, userId: req.user.id });
    return res.status(201).json(about);
  } catch (error) {
    return res.status(500).json(error);
  }
});

aboutController.put("/updateAbout/:id", verifyToken, async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (about.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can update only your own posts");
    }

    const updatedAbout = await About.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("userId", "-password");

    return res.status(200).json(updatedAbout);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

aboutController.delete("/deleteAbout/:id", verifyToken, async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    if (about.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can delete only your own posts");
    }

    await About.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "Successfully deleted the About" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = aboutController;
