const mongoose = require("mongoose");

const AboutSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    titleOne: {
      type: String,
      required: true,
      min: 4,
    },
    descOne: {
      type: String,
      required: true,
      min: 12,
    },
    titleTwo: {
      type: String,
      required: true,
      min: 4,
    },
    descTwo: {
      type: String,
      required: true,
      min: 12,
    },
    subTitleTwo: {
      type: String,
      required: true,
      min: 12,
    },
    subTitleDes: {
      type: String,
      required: true,
      min: 12,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", AboutSchema);
