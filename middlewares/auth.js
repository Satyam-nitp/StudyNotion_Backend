const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
// auth middleware

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.body?.token ||
      req.cookies.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Now available to controllers as req.user
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying token",
    });
  }
};

//isStudent.js
exports.isStudent = (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a student.",
      });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again later",
    });
  }
};

//isInstructor.js
exports.isInstructor = (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not an instructor.",
      });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again later",
    });
  }
};

// isAdmin.js
exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not an admin.",
      });
    }
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role can't be verified, please try again later",
    });
  }
};
