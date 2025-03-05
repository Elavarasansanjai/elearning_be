const express = require("express");
const router = express.Router();
const userControler = require("../../controlers/userControler/userControler");
const Auth = require("../../middlewares/auth.middlewares");

router.post("/register", userControler.Register);
router.post("/login", userControler.login);
router.get("/auth", Auth, userControler.userAhuth);
router.get("/profile", Auth, userControler.getUserDetail);

module.exports = router;
