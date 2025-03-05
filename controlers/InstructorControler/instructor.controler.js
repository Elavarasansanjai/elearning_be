const courseModel = require("../../models/course.model");
const userModel = require("../../models/user.model");
const cloudConfig = require("../../utils/cloudConfig");
const streamifier = require("streamifier");
const createCourse = async (req, res) => {
  try {
    let { title, description, quizzes } = req.body;
    quizzes = JSON.parse(quizzes);
    const video = req.files.video;
    console.log(video);

    if (!title || !description || !quizzes || !video) {
      return res.status(200).json({ msg: "Bad Gatway! ", code: 400 });
    }
    const userId = req.userId;
    const findUser = await userModel.findOne({ _id: userId });
    if (!findUser || findUser.role !== "Instructor") {
      return res
        .status(200)
        .json({ msg: "You are not Instructor!", code: 400 });
    }

    let uploadUrl;
    const stream = cloudConfig.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        console;
        if (error) {
          console.log(error);
          return res.status(200).json({ msg: "Upload file error!", code: 400 });
        } else {
          const newCourse = courseModel.create({
            title,
            description,
            instructor: userId,
            videos: [result?.secure_url],
            quizzes: quizzes,
          });
        }
      }
    );
    streamifier.createReadStream(video.data).pipe(stream);
    console.log(uploadUrl);

    return res.status(200).json({
      msg: "Course created successfully",
      code: 200,
      //   course: newCourse,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ msg: "Internal server error", code: 500 });
  }
};

const editeCourse = async (req, res) => {
  try {
    let { course_id, quizzes, title, description } = req.body;
    const video = req.files.video;
    quizzes = JSON.parse(quizzes);
    if (!quizzes || !title || !description) {
      return res
        .status(200)
        .json({ msg: "Please Provide required data", code: 400 });
    }
    const userId = req.userId;
    const findUser = await userModel.findOne({ _id: userId });
    if (!findUser || findUser.role !== "Instructor") {
      return res
        .status(200)
        .json({ msg: "You are not Instructor!", code: 400 });
    }

    let getCourse = await courseModel.findOne({ _id: course_id });
    console.log(getCourse);

    if (!getCourse) {
      return res.status(200).json({ msg: "Course not found", code: 400 });
    }

    if (video) {
      const stream = cloudConfig.uploader.upload_stream(
        { resource_type: "video" },
        (error, result) => {
          console;
          if (error) {
            console.log(error);
            return res
              .status(200)
              .json({ msg: "Upload file error!", code: 400 });
          } else {
            console.log(
              "enter 2333333333333333333333333333333333333",
              title,
              description,
              course_id,
              quizzes
            );
            getCourse.title = title;
            getCourse.description = description;
            getCourse.videos = [result?.secure_url];
            getCourse.quizzes = quizzes;
            getCourse.save();
          }
        }
      );
      streamifier.createReadStream(video.data).pipe(stream);
    } else {
      getCourse.title = title;
      getCourse.description = description;
      getCourse.quizzes = quizzes;
      await getCourse.save();
    }
    return res.status(200).json({ msg: "success", code: 200 });
  } catch (err) {
    return res.status(200).json({ msg: "Internal server error!", code: 500 });
  }
};

const getCourse = async (req, res) => {
  try {
    const courses = await courseModel.find({ instructor: req?.userId });
    return res.status(200).json({ msg: "", data: courses, code: 200 });
  } catch (err) {
    return res.status(200).json({ msg: "Internal server error", code: 500 });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { course_id } = req.body;
    if (!course_id) {
      return res.status(200).json({ msg: "bad gateway", code: 400 });
    }
    const findId = await courseModel.findOne({ _id: course_id });
    if (!findId) {
      return res.status(200).json({ msg: "course not found!", code: 400 });
    }
    await courseModel.findByIdAndDelete({ _id: course_id });
    return res.status(200).json({ msg: "seccuss delete", code: 200 });
  } catch (err) {
    return res.status(200).json({ msg: "Internal server error", code: 500 });
  }
};

module.exports = { createCourse, getCourse, editeCourse, deleteCourse };
