const express=require("express");
const { createCourse, getAllCourses, getCourseDetails, editCourse, getFullCourseDetails, getInstructorCourses, deleteCourse } = require("../controllers/Course");
const router=express.Router();
const { getAllCategories, categoryPageDetails, createCategory } = require("../controllers/Category")
const { createSection, updateSection, deleteSection } = require("../controllers/Section")
const { updateSubSection, deleteSubSection, createSubSection } = require("../controllers/Subsection")
const { createRating, getAverageRating, getAllRating } = require("../controllers/RatingAndReview")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");
const { updateCourseProgress } = require("../controllers/CourseProgress");

router.post("/createCourse", auth, isInstructor, createCourse);
router.post("/editCourse", auth, isInstructor, editCourse);
router.post("/addSection", auth, isInstructor, createSection);
router.post("/updateSection", auth, isInstructor, updateSection);
router.post("/deleteSection", auth, isInstructor, deleteSection);
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
router.post("/addSubSection", auth, isInstructor, createSubSection);
router.get("/getAllCourses", getAllCourses);
router.post("/getCourseDetails", getCourseDetails);
router.post("/getFullCourseDetails", auth, getFullCourseDetails);
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.delete("/deleteCourse", deleteCourse);
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


router.get("/showAllCategories", getAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);
router.post("/createCategory",auth, isAdmin, createCategory);


router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);


module.exports=router;

