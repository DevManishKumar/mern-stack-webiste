const newsController = require("express").Router();
const News = require("../models/News");
const verifyToken = require("../middlewares/verifyToken");

newsController.get("/getAll", async (req, res) => {
  try {
    const news = await News.find({}).populate("userId", "-password");
    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json(error);
  }
});

newsController.get("/find/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate(
      "userId",
      "-password"
    );
    news.views += 1;
    await news.save();
    return res.status(200).json(news);
  } catch (error) {
    return res.status(500).json(error);
  }
});


newsController.post("/", verifyToken, async (req, res) => {
  try {
    const news = await News.create({ ...req.body, userId: req.user.id });
    return res.status(201).json(news);
  } catch (error) {
    return res.status(500).json(error);
  }
});

newsController.put("/updatenews/:id", verifyToken, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news.userId.toString() !== req.user.id.toString()) {
      throw new Error("You can update only your own posts");
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate("userId", "-password");

    return res.status(200).json(updatedNews);
  } catch (error) {
    return res.status(500).json(error.message);
  }
});


newsController.delete(
  "/deletenews/:id",
  verifyToken,
  async (req, res) => {
    try {
      const news = await News.findById(req.params.id);
      if (news.userId.toString() !== req.user.id.toString()) {
        throw new Error("You can delete only your own posts");
      }

      await News.findByIdAndDelete(req.params.id);

      return res.status(200).json({ msg: "Successfully deleted the news" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

module.exports = newsController;
