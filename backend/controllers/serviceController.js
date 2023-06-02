const serviceController = require("express").Router();
const Service = require("../models/Service");
const verifyToken = require("../middlewares/verifyToken");

serviceController.get("/getAll", async (req, res) => {
  try {
    const services = await Service.find({}).populate("userId", "-password");
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json(error);
  }
});

serviceController.get("/find/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate(
      "userId",
      "-password"
    );
    service.views += 1;
    await service.save();
    return res.status(200).json(service);
  } catch (error) {
    return res.status(500).json(error);
  }
});

serviceController.post("/", verifyToken, async (req, res) => {
  try {
    const service = await Service.create({ ...req.body, userId: req.user.id });
    return res.status(201).json(service);
  } catch (error) {
    return res.status(500).json(error);
  }
});

serviceController.put("/updateService/:id", verifyToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can update only your own posts");
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("userId", "-password");

    return res.status(200).json(updatedService);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

serviceController.delete("/deleteService/:id", verifyToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can delete only your own posts");
    }

    await Service.findByIdAndDelete(req.params.id);

    return res.status(200).json({ msg: "Successfully deleted the Service" });
  } catch (error) {
    return res.status(500).json(error);
  }
});

module.exports = serviceController;
