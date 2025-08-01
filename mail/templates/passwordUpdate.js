exports.passwordUpdate = (email, name) => {
  return `
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Password Update Notification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 0;
            margin: 0;
            font-size: 16px;
            line-height: 1.4;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .logo{
            max-width: 200px;
            margin-bottom: 20px;
          }
          .message{
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
          }
            .body{
            font-size: 16px;
            margin-bottom: 20px;
            }
            .support{
            font-size: 14px;
            margin-top: 20px;
            color: #999999;
          }
            .highlight {
            font-weight: bold;
}
        </style>
      </head>
      <body>
<div class="container">
  <a href="https://studynotion-edtech-project.vercel.app"><img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo"></a>
  <div class="message">Password Update Notification</div>
  <div class="body">
    <p>Hey ${name},</p>
    <p>Your password has been successfully updated for the email <span class="highlight">${email}</span>.</p>
    <p>If you did not initiate this change, please contact our support team immediately.</p>
    <p>Thank you for using our service!</p>
  </div>
  <div class="support">If you have any questions, feel free to reach out to our support at <a href="mailto:satyamsingh2004alld@gmail.com">satyamsingh2004alld@gmail.com</a>.</div>
</div>
      </body>
    </html>
  `;
};
