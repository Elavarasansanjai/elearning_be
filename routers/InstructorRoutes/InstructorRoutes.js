const express = require("express");
const router = express.Router();
const instructorRouter = require("./courseRouter");

router.use("/course", instructorRouter);

module.exports = router;
