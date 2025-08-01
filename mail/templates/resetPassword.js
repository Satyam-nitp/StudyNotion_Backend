const resetPasswordTemplate = (resetUrl) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Your Password</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #ffffff;
          color: #333333;
          margin: 0;
          padding: 0;
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
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #facc15; /* yellow-400 */
          color: #000000;
          text-decoration: none;
          font-weight: bold;
          border-radius: 6px;
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
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>
          We received a request to reset your password for your StudyNotion account.
          Click the button below to reset your password:
        </p>
        <a class="button" href="${resetUrl}" target="_blank">Reset Password</a>
        <p style="margin-top: 30px;">
          If you did not request a password reset, please ignore this email. This link will expire in 10 minutes.
        </p>
        <div class="footer">
          Need help? Contact us at <a href="mailto:satyamsingh2004alld@gmail.com">satyamsingh2004alld@gmail.com</a>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = resetPasswordTemplate;
