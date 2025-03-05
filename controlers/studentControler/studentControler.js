const { default: mongoose } = require("mongoose");
const courseModel = require("../../models/course.model");
const userModel = require("../../models/user.model");

const getAllCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findOne({ _id: userId });
    if (!user || user.role !== "Student") {
      return res.status(200).json({ msg: "Bad Gateway!", code: 400 });
    }
    let getAllCourse = await courseModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "instructor",
          foreignField: "_id",
          as: "result",
        },
      },

      {
        $project: {
          title: "$title",
          description: "$description",
          videos: "$videos",
          author: "$result.name",
          quizzes: {
            $map: {
              input: "$quizzes",
              as: "grade",
              in: {
                question: "$$grade.question",
                options: "$$grade.options",
                _id: "$$grade._id",
              },
            },
          },
          certificate: "$progress",
        },
      },
    ]);

    getAllCourse = getAllCourse.map((courses) => {
      const checkStudentPercentage = courses?.certificate.find((student) =>
        student.student.equals(new mongoose.Types.ObjectId(req.userId))
      );
      console.log(checkStudentPercentage, "|||||||||||||||||||");
      if (
        checkStudentPercentage &&
        checkStudentPercentage?.percentage === 100
      ) {
        return { ...courses, certificate: true };
      } else {
        return { ...courses, certificate: false };
      }
    });

    return res
      .status(200)
      .json({ msg: "success", code: 200, data: getAllCourse });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ msg: "Internal server error!", code: 200 });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { course_id, qustion_id, answer } = req.body;
    if (!course_id || !qustion_id || !answer) {
      return res.status(200).json({ msg: "Bad Gateway", code: 400 });
    }
    let takeCourse = await courseModel.findById({
      _id: course_id,
    });
    if (!takeCourse) {
      return res.status(200).json({ msg: "course nnot found!", code: 400 });
    }
    const findQuestion = takeCourse.quizzes.find((course) => {
      return course._id.equals(new mongoose.Types.ObjectId(qustion_id));
    });
    if (!findQuestion) {
      return res.status(200).json({ msg: "question not found!", code: 400 });
    }
    if (findQuestion.correctAnswer === answer) {
      const finduser = takeCourse.progress.find((course) => {
        return course.student.equals(new mongoose.Types.ObjectId(req.userId));
      });
      console.log(finduser, "============ find user");
      if (!finduser) {
        takeCourse.progress = [
          ...takeCourse.progress,
          { student: req.userId, percentage: 100 },
        ];
      } else {
        takeCourse.progress = takeCourse.progress.map((item) => {
          if (item.student.equals(new mongoose.Types.ObjectId(req.userId))) {
            return {
              ...item,
              percentage: 100,
            };
          } else {
            return item;
          }
        });
      }

      await takeCourse.save();
      return res
        .status(200)
        .json({
          msg: "Good! 100% score Now you can download your certificate",
          code: 200,
        });
    } else {
      const finduser = takeCourse.progress.find((course) => {
        return course.student.equals(new mongoose.Types.ObjectId(req.userId));
      });
      console.log(finduser, "============ find user");
      if (!finduser) {
        takeCourse.progress = [
          ...takeCourse.progress,
          { student: req.userId, percentage: 0 },
        ];
      }
      await takeCourse.save();
      return res
        .status(200)
        .json({ msg: "Bad Please try again Bad Answer", code: 400 });
    }
  } catch (err) {
    console.log(err);
    return res.status(200).json({ msg: "Internal server error!", code: 500 });
  }
};

module.exports = { getAllCourses, submitAnswer };
