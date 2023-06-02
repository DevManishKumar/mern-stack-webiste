const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const authController = require("./controllers/authController");
const projectController = require("./controllers/projectController");
const bannerController = require("./controllers/bannerController");
const aboutController = require("./controllers/aboutController");
const serviceController = require("./controllers/serviceController");
const newsController = require("./controllers/newsController");
const multer = require("multer");

const app = express();

// connect db

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    // You can start interacting with the database here
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// routes
app.use("/images", express.static("public/images"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authController);
app.use("/project", projectController);
app.use("/banner", bannerController);
app.use("/about", aboutController);
app.use("/service", serviceController);
app.use("/news", newsController);

//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, req.body.filename);
  },
});

const upload = multer({
  storage: storage,
});

app.post("/upload", upload.single("image"), async (req, res) => {
  return res.status(200).json({ msg: "Successfully uploaded" });
});

// connect server
app.listen(process.env.PORT || 5000, () =>
  console.log("Server has been started successfully.")
);
