const express = require("express");
const instructorControler = require("../../controlers/InstructorControler/instructor.controler");
const router = express.Router();

router.post("/create", instructorControler.createCourse);
router.get("/get", instructorControler.getCourse);
router.post("/update", instructorControler.editeCourse);
router.post("/delete", instructorControler.deleteCourse);

module.exports = router;
