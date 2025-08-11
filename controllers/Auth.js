const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/mailSender"); // Assuming you have a utility to send emails
const Profile = require("../models/Profile");
const template = require("../mail/templates/contactUsTemplate");
const { passwordUpdate } = require("../mail/templates/passwordUpdate");

require("dotenv").config();

// send otp controller
exports.sendOTP = async (req, res) => {
  // fetch email from request body
  const { email } = req.body;

  try {
    // Check if user exists
    const checkUserPresent = await User.findOne({ email });

    // if user already exists, return reponse
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("Generated OTP:", otp);

    //unique OTP for each email
    const otpData = await OTP.findOne({ otp: otp });

    while (otpData) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      otpData = await OTP.findOne({ otp: otp });
      console.log("Regenerated OTP:", otp);
    }

    // Save OTP to database
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP saved to database:", otpBody);

    res.status(200).json({
      success: true,
      otp,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// signup controller
exports.signup = async (req, res) => {
  try {
    // Destructure and sanitize input
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      contactNumber,
      accountType,
      otp,
    } = req.body;

    // ✅ Trim and normalize email
    const normalizedEmail = email?.trim().toLowerCase();

    const instructorAccounts = [
      { email: "satyamsingh2004nitp@gmail.com", password: "INST01" },
      { email: "satyamsingh2004alld@gmail.com", password: "INST02" },
      { email: "princechouhan3010@gmail.com", password: "Prince03" },
    ];

    if (
      accountType === "Instructor" &&
      !instructorAccounts.some(
        (inst) => inst.email === email && inst.password === password
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Your email or password is incorrect. Please contact your Admin.",
      });
    }

    // ✅ Validate required fields
    if (
      !firstName ||
      !lastName ||
      !normalizedEmail ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // ✅ Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // ✅ Get the most recent OTP
    const otpRecord = await OTP.findOne({ email: normalizedEmail }).sort({
      createdAt: -1,
    });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create profile first
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // ✅ Create user and link profile
    const newUser = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/6.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // ✅ Return success response
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({
      success: false,
      message: "Signup failed",
    });
  }
};

// login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, please signup",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    const userData = user.toObject();
    userData.token = token;
    delete userData.password;

    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user: userData,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      success: false,
      message: "Login failed, please try again",
    });
  }
};

// change password controller
exports.changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);

    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    try {
      const emailResponse = await sendEmail(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdate(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

exports.sendmsg = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, msg } = req.body;
    if (!firstName || !lastName || !email || !contactNumber || !msg) {
      return res.status(400).json({
        success: false,
        message: "All fields required!!",
      });
    }

    const mailResponse = await sendEmail(
      email,
      "Thanks For filling the form",
      template(firstName, lastName, email, contactNumber, msg)
    );
    console.log("Email sent successfully: ", mailResponse);

    return res.status(200).json({
      success: true,
      message: "Thanks for Contacting us, we will reach you soon",
      mailResponse,
    });
  } catch (error) {
    console.log("Error in contactUs: ", error);
    return res.status(500).json({
      success: false,
      message: "Error in contacting you",
    });
  }
};
