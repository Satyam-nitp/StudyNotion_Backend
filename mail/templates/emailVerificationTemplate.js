const otpTemplate = (otp) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>OTP Verification Email</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          margin: 0;
          padding: 0;
          color: #333333;
        }
        .container {
          max-width: 600px;
          margin: auto;
          padding: 40px 20px;
          text-align: center;
        }
        .logo {
          width: 150px;
          margin-bottom: 20px;
        }
        .otp {
          font-size: 28px;
          font-weight: bold;
          color: #000000;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          color: #888888;
          margin-top: 40px;
        }
        .footer a {
          color: #007BFF;
          text-decoration: none;
        }
        .footer a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img class="logo" src="https://studynotion-edtech-project.vercel.app/logo.png" alt="StudyNotion Logo" />
        <h2>OTP Verification Email</h2>
        <p>Dear User,</p>
        <p>
          Thank you for registering with <strong>StudyNotion</strong>. To complete your registration,
          please use the following OTP (One-Time Password) to verify your account:
        </p>
        <div class="otp">${otp}</div>
        <p>
          This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
          Once your account is verified, you will have access to our platform and its features.
        </p>
        <div class="footer">
          If you have any questions or need assistance, please feel free to reach out to us at
          <a href="mailto:satyamsingh2004alld@gmail.com">satyamsingh2004alld@gmail.com</a>.
          <br/>We are here to help!
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = otpTemplate;
