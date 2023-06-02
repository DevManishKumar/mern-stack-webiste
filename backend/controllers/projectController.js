const projectController = require("express").Router();
const Project = require("../models/Projects");
const verifyToken = require("../middlewares/verifyToken");

projectController.get("/getAll", async (req, res) => {
  try {
    const projects = await Project.find({}).populate("userId", "-password");
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json(error);
  }
});

projectController.get("/find/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "userId",
      "-password"
    );
    project.views += 1;
    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// projectController.get("/featured", async (req, res) => {
//   try {
//     const projects = await Project.find({ featured: true })
//       .populate("userId", "-password")
//       .limit(3);
//     return res.status(200).json(projects);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });

projectController.post("/", verifyToken, async (req, res) => {
  try {
    const project = await Project.create({ ...req.body, userId: req.user.id });
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json(error);
  }
});

projectController.put("/updateproject/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can update only your own posts");
    }

    const updatedproject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("userId", "-password");

    return res.status(200).json(updatedproject);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// projectController.put("/likeproject/:id", verifyToken, async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (project.likes.includes(req.user.id)) {
//       project.likes = project.likes.filter((userId) => userId !== req.user.id);
//       await project.save();

//       return res.status(200).json({ msg: "Successfully unliked the project" });
//     } else {
//       project.likes.push(req.user.id);
//       await project.save();

//       return res.status(200).json({ msg: "Successfully liked the project" });
//     }
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// });

projectController.delete("/deleteproject/:id", verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can delete only your own posts");
    }

    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "Successfully deleted the project" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = projectController;
