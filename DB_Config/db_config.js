const mongoose = require("mongoose");

try {
  const ELEARNING_DB = mongoose.createConnection(process.env.ELEARNING_DB_URL);
  module.exports = ELEARNING_DB;
  console.log("db coneected success");
} catch (err) {
  console.log(err);
}
