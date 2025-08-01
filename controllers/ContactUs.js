const { contactUsEmail } = require("../mail/templates/contactUsTemplate");
const { instructorConfirmationEmail } = require("../mail/templates/instructorConfirmationTemplate");
const { instructorContactEmail } = require("../mail/templates/instructorContactEmail");
const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } =
    req.body;
  console.log(req.body);
  try {
    await mailSender(
      email,
      "Your Data send successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );
    return res.json({
      success: true,
      message: "Email send successfully",
    });
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Something went wrong...",
    });
  }
};

exports.contactInstructorController = async (req, res) => {
  const {
    name,
    email,
    domain,
    experience,
    linkedin,
    portfolio,
    message
  } = req.body;

  try {
    await mailSender(
      "satyamsingh2004alld@gmail.com", // or any admin email
      "New Instructor Contact Request",
      instructorContactEmail({
        name,
        email,
        domain,
        experience,
        linkedin,
        portfolio,
        message,
      })
    );

    // 2. Send confirmation email to instructor
    await mailSender(
      email,
      "Your request has been received",
      instructorConfirmationEmail({
        name,
        domain,
      })
    );

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending email",
    });
  }
};
