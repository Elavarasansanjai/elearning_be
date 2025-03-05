const express = require("express");
const router = express.Router();
const userRouter = require("./user.router/user.router");
const InstructorRoutes = require("./InstructorRoutes/InstructorRoutes");
const studentRouter = require("./studentRouter/studentRouter");
const Auth = require("../middlewares/auth.middlewares");

router.use("/user", userRouter);
router.use("/instructor", Auth, InstructorRoutes);
router.use("/student", Auth, studentRouter);

module.exports = router;
