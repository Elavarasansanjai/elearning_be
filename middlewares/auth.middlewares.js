const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const Auth = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(200).json({ msg: "Unauthorized", code: 400 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const findUser = await userModel.findOne({ _id: decoded.userId });
    if (!findUser) {
      return res.status(200).json({ msg: "Not A valid User!", code: 400 });
    }
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(200).json({ msg: "Unauthorized", code: 500 });
  }
};

module.exports = Auth;
