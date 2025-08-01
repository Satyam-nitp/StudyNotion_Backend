exports.instructorConfirmationEmail = ({ name, domain }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Instructor Request Received</title>
      <style>
          body {
              background-color: #ffffff;
              font-family: Arial, sans-serif;
              font-size: 16px;
              color: #333;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: auto;
              padding: 20px;
              text-align: center;
          }
          .logo {
              max-width: 180px;
              margin-bottom: 20px;
          }
          .message {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 15px;
          }
          .body {
              text-align: left;
              font-size: 16px;
          }
          .support {
              font-size: 14px;
              color: #999;
              margin-top: 20px;
              text-align: center;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <a href="https://studynotion-edtech-project.vercel.app">
              <img src="https://i.ibb.co/7Xyj3PC/logo.png" class="logo" alt="StudyNotion Logo">
          </a>
          <div class="message">Thank you for reaching out!</div>
          <div class="body">
              <p>Dear ${name},</p>
              <p>We have received your request to connect with us regarding the <strong>${domain}</strong> domain.</p>
              <p>Our team will review your message and get back to you shortly.</p>
              <p>We appreciate your interest in becoming an instructor at StudyNotion!</p>
          </div>
          <div class="support">
              Need help? Contact us at <a href="mailto:info@studynotion.com">info@studynotion.com</a>
          </div>
      </div>
  </body>
  </html>`;
};
