const express=require("express");
const { updateProfile, deleteAccount, getAllUserDetails, updateProfilePicture, getEnrolledCourses, instructorDashboard } = require("../controllers/Profile");
const router=express.Router();
const { auth, isStudent, isInstructor } = require("../middlewares/auth");

router.put("/updateProfile", auth,  updateProfile);
router.delete("/deleteProfile",auth, isStudent, deleteAccount);
router.get("/getUserDetails", auth, getAllUserDetails);
router.put("/updateDisplayPicture", auth, updateProfilePicture);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);


module.exports=router;

