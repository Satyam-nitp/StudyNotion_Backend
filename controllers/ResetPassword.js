const User = require("../models/User");
const bcrypt = require("bcrypt");
const mailSender = require("../utils/mailSender");
const template=require("../mail/templates/resetPassword");

// reset password token
exports.resetPasswordToken = async (req, res) => {
  // fetch email from request body
  //check user exist
  //generate token
  //update user with token and resetPasswordExpires
  //create url
  //send email with url
  // return response
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Your email is not registered, please signup",
      });
    }

    // Generate token
    const token = crypto.randomUUID();
    console.log("token: ",token);
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
      },
      { new: true }
    );

    console.log("Details: ", updatedDetails)
    // Create URL
    const url = `http://localhost:3000/update-password/${token}`;

    // Send email with URL
    await mailSender(
      email,
      "Reset Password",
      template(url),
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "Password reset email sent, please check your inbox",
    });
  } catch (error) {
    console.error("Error in resetPasswordToken:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Reset password controller
exports.resetPassword = async (req, res) => {
  // fetch token , new password and confirm password from request body
  //validation
  //get user details from db using token
  //if no entry-invalid token
  //check if token is expired
  //hash password
  //password update
  // return response
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, new password and confirm password are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid token",
      });
    }

    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token has expired, please request a new one",
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await User.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
