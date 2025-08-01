const Course = require("../models/Course");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader"); // Assuming you have a utility to handle image uploads
const { convertSecondsToDuration } = require("../utils/SecToDuration");

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    //fetch data from request body
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag,
      instructions,
    } = req.body;
    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail ||
      !tag ||
      !instructions
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log("Instructor Details:", instructorDetails);

    if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not an instructor.",
      });
    }

    //check if tag exists
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    //upload thumbnail to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create course entry in the database
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tag,
      instructions,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      instructor: instructorDetails._id,
    });

    //add the course to the instructor's courses
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    //update the tag schema
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      { $push: { course: newCourse._id } },
      { new: true }
    );

    //return success response
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error in createCourse:", error);
    return res.status(500).json({
      success: false,
      message: "Course can't be created due to some error",
    });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    Object.keys(updates).forEach((key) => {
      if (key === "tag" || key === "instructions") {
        course[key] = Array.isArray(updates[key])
          ? updates[key]
          : JSON.parse(updates[key]);
      } else if (key !== "courseId") {
        course[key] = updates[key];
      }
    });

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate({
        path: "instructor",
        populate: [{ path: "additionalDetails" }, { path: "courses" }],
      })
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .exec();

    // Return success response with courses
    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.error("Error in getAllCourses:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//getcourseDetails

exports.getCourseDetails = async (req, res) => {
  try {
    //course id
    const { courseId } = req.body;
    //find course details
    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .exec();

      console.log("Course Details:", courseDetails);

    let totalDurationInSeconds = 0;
    courseDetails?.courseContent?.forEach((content) => {
      content?.subsection?.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subsection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getInstructorCourses = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const instructorCourses = await Course.find({
      instructor: instructorId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      })
      .exec();

    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const studentsEnrolled = course.studentsEnrolled;
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subsection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      await Section.findByIdAndDelete(sectionId);
    }

    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
