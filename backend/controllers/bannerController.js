const bannerController = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const Banner = require("../models/Banner");

bannerController.get("/getAll", async (req, res) => {
  try {
    const banners = await Banner.find({}).populate("userId", "-password");
    return res.status(200).json(banners);
  } catch (error) {
    return res.status(500).json(error);
  }
});

bannerController.get("/find/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id).populate(
      "userId",
      "-password"
    );
    banner.views += 1;
    await banner.save();
    return res.status(200).json(banner);
  } catch (error) {
    return res.status(500).json(error);
  }
});

bannerController.post("/", verifyToken, async (req, res) => {
  try {
    const banner = await Banner.create({ ...req.body, userId: req.user.id });
    return res.status(201).json(banner);
  } catch (error) {
    return res.status(500).json(error);
  }
});

bannerController.put("/updateproject/:id", verifyToken, async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can update only your own posts");
    }

    const updatedbanner = await Banner.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("userId", "-password");

    return res.status(200).json(updatedbanner);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});


bannerController.delete(
  "/deleteproject/:id",
  verifyToken,
  async (req, res) => {
    try {
      const banner = await Banner.findById(req.params.id);
      if (banner.userId.toString() !== req.user.id.toString()) {
        throw new Error("You can delete only your own posts");
      }

      await Banner.findByIdAndDelete(req.params.id);

      return res.status(200).json({ msg: "Successfully deleted the project" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

module.exports = bannerController;
