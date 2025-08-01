const { instance } = require("../config/razorpay");
const User = require("../models/User");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const { paymentSuccessEmail } = require("../mail/templates/PaymentSuccessEmail");

// initiate the razorpay order
exports.capturePayment = async (req, res) => {
  const { courses } = req.body;
  const userId = req.user.id;
  if (!courses.length) {
    return res.json({ success: false, message: "Please Provide Course ID" });
  }
  let total_amount = 0;
  for (const course_id of courses) {
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" });
      }
      const uid = new mongoose.Types.ObjectId(userId);
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" });
      }
      total_amount += course.price;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: Math.random(Date.now()).toString(),
  };
  try {
  const paymentResponse = await instance.orders.create(options);

  console.log("Payment Order Created:", paymentResponse);

  res.json({
    success: true,
    data: paymentResponse,
  });
} catch (error) {
  console.error("Error in Razorpay Order Creation:", error);

  return res.status(500).json({
    success: false,
    message: "Could not initiate order.",
    error: error?.message || "Unknown error",
  });
}

};

exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;
  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(200).json({ success: false, message: "Payment Failed" });
  }
  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");
  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId, res);
    return res.status(200).json({ success: true, message: "Payment Verified" });
  }
  return res.status(200).json({ success: false, message: "Payment Failed" });
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;

  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" });
  }

  try {
    const enrolledStudent = await User.findById(userId);

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.log("error in sending mail", error);
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" });
  }
};

const enrollStudents = async (courses, userId, res) => {
  if (!courses || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please Provide Course ID and User ID",
    });
  }

  for (const courseId of courses) {
    try {
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" });
      }
      console.log("Updated course: ", enrolledCourse);

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });

      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      );

      console.log("Enrolled student: ", enrolledStudent);

      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
        )
      );

      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};

// //capture payment
// exports.capturePayment = async (req, res) => {
//   //get payment id and course id from request body
//   const { courseId } = req.body;
//   const userId = req.user.id; // Assuming user ID is stored in req.user

//   //validate input
//   if (!userId || !courseId) {
//     return res.status(400).json({
//       success: false,
//       message: "User ID and Course ID are required",
//     });
//   }

//   // valid coursedetails
//   try {
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({
//         success: false,
//         message: "Course not found",
//       });
//     }
//     // Check if the user is already enrolled in the course
//     const uid = mongoose.Types.ObjectId(userId);
//     if (course.studentsEnrolled.includes(uid)) {
//       return res.status(400).json({
//         success: false,
//         message: "User is already enrolled in this course",
//       });
//     }
//   } catch (error) {
//     return res.status(404).json({
//       success: false,
//       message: "Course not found",
//     });
//   }

//   //create order
//   const amount = course.price * 100; // amount in the smallest currency unit
//   const currency = "INR"; // currency code

//   const options = {
//     amount: amount, // amount in smallest currency unit
//     currency: currency,
//     receipt: Math.random(Date.now()).toString(),
//     notes: {
//       userId: userId,
//       courseId: courseId,
//     },
//   };

//   try {
//     const order = await instance.orders.create(options);
//     console.log("Razorpay order created:", order);
//     return res.status(200).json({
//       success: true,
//       courseName: course.courseName,
//       message: "Payment order created successfully",
//       courseDescription: course.courseDescription,
//       thumbnail: course.thumbnail,
//       currency: order.currency,
//       orderId: order.id,
//       amount: order.amount, // convert to original amount
//     });
//   } catch (error) {
//     console.error("Error creating Razorpay order:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create payment order",
//     });
//   }

//   // return response
// };

// //verify signature and capture payment
// exports.verifySignature = async (req, res) => {
//   const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//   const signature = req.headers["x-razorpay-signature"];

//   crypto.createHmac("sha256", webhookSecret);
//   shasum.update(JSON.stringify(req.body));
//   const digest = shasum.digest("hex");

//   if (signature === digest) {
//     console.log("Payment is authorised");

//     const { courseId, userId } = req.body.payload.entity.notes;

//     try {
//       const enrolledCourse = await Course.findOneAndUpdate(
//         { _id: courseId },
//         { $push: { studentsEnrolled: userId } },
//         { new: true }
//       );

//       if (!enrolledCourse) {
//         return res.status(500).json({
//           success: false,
//           message: "Course not found",
//         });
//       }

//       console.log(enrolledCourse);

//       //find student and add the course to the enrolled course
//       const enrolledStudent = await User.findOneAndUpdate(
//         { _id: userId },
//         { $push: { courses: courseId } },
//         { new: true }
//       );

//       console.log(enrolledStudent);

//       //mail send
//       const emailResponse = await mailSender(
//         enrolledStudent.email,
//         "Congratulations from CodeHelp",
//         "Congratulations, you are onboarded into new course"
//       );

//       console.log(emailResponse);
//       return res.status(200).json({
//         success: true,
//         message: "Signature Verified and Course Added",
//       });
//     } catch (error) {
//       console.log(error);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   } else {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid request",
//     });
//   }
// };
