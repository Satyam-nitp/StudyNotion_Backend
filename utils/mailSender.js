const nodeMailer = require("nodemailer");

const mailSender = async (email, title, template) => {
  try {
    let transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });


    const mailOptions = {
      from: 'Satyam Singh <' + process.env.EMAIL + '>',
      to: email,
      subject: title,
      html: template,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);
    return info;
  } catch (error) {
    console.log(error.message);
    console.error(error);
  }
};

module.exports = mailSender;
// This utility function sends an email using nodemailer.
// It takes an email address, a title, and a body as parameters.    
// The email is sent using the SMTP configuration provided in environment variables.
// The email is sent from the address specified in the environment variable EMAIL.