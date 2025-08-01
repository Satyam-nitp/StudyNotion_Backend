const express=require("express");

const { signup, login, changePassword, sendOTP, sendmsg } = require("../controllers/Auth");
const { resetPasswordToken, resetPassword } = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");
const router=express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/changePassword", auth, changePassword);
router.post("/sendotp", sendOTP);
router.post("/sendmsg", sendmsg);

router.post("/reset-password-token", resetPasswordToken)
router.post("/reset-password", resetPassword)

module.exports=router;

