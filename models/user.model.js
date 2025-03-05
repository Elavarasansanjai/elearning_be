const mongoose = require("mongoose");
const ELEARNING_DB = require("../DB_Config/db_config");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Instructor", "Student"],
      default: "Student",
    },
    name: { type: String, required: true },
  },
  { timeseries: true }
);

const userModel = ELEARNING_DB.model("User", userSchema);
module.exports = userModel;
