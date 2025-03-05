const express = require("express");
const studentControler = require("../../controlers/studentControler/studentControler");
const router = express.Router();

router.get("/getall/course", studentControler.getAllCourses);
router.post("/submit/ans", studentControler.submitAnswer);

module.exports = router;
