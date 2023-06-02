const mongoose = require("mongoose");

const BannerSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      min: 4,
    },
    subTitle: {
      type: String,
      required: true,
      min: 12,
    },
    img: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", BannerSchema);
