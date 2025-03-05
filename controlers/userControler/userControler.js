const userModel = require("../../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Register = async (req, res) => {
  try {
    const { email, password, role, name } = req.body;

    if (!email || !password || !role || !name) {
      return res.status(200).json({ msg: "Bad Request!", code: 400 });
    }
    const availableRole = ["Admin", "Instructor", "Student"];
    if (!availableRole.includes(role)) {
      return res.status(200).json({ msg: "Invalid Role!", code: 400 });
    }
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(200).json({ msg: "User already exists", code: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      email,
      password: hashedPassword,
      role,
      name: name.toUpperCase(),
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .json({ code: 200, msg: "Success", token, userType: role });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ msg: "Internal server error!", code: 500 });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ msg: "email not found! Please Register", code: 400 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(200).json({ msg: "Invalid credentials", code: 400 });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res
      .status(200)
      .json({ code: 200, msg: "Success", token, userType: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const getUserDetail = async (req, res) => {
  try {
    const userId = req.userId;
    const userDetail = await userModel.findById({ _id: userId });
    if (!userDetail) {
      return res.status(200).json({ msg: "Bad GateWay!", code: 400 });
    }
    return res
      .status(200)
      .json({ msg: "", data: { name: userDetail?.name }, code: 200 });
  } catch (err) {
    return res.status(200).json({ msg: "Internal server error!", code: 200 });
  }
};

const userAhuth = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById({ _id: userId });
    return res.status(200).json({ msg: "", code: 200, userType: user?.role });
  } catch (err) {
    return res.status(200).json({ msg: "Internal server error" });
  }
};

module.exports = { Register, login, userAhuth, getUserDetail };
