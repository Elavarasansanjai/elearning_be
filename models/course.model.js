const mongoose = require("mongoose");
const ELEARNING_DB = require("../DB_Config/db_config");

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    videos: [{ type: String }],
    quizzes: [{ question: String, options: [String], correctAnswer: String }],

    progress: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        percentage: Number,
      },
    ],
  },
  { timeseries: true }
);

const courseModel = ELEARNING_DB.model("Course", courseSchema);
module.exports = courseModel;
