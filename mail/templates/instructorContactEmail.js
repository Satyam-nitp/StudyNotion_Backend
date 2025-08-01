exports.instructorContactEmail = ({
  name,
  email,
  domain,
  experience,
  linkedin,
  portfolio,
  message,
  resumeUrl,
}) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Instructor Contact Request</title>
    <style>
      body {
        background-color: #ffffff;
        font-family: Arial, sans-serif;
        font-size: 16px;
        line-height: 1.4;
        color: #333333;
        margin: 0;
        padding: 0;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        text-align: center;
      }

      .logo {
        max-width: 200px;
        margin-bottom: 20px;
      }

      .message {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
      }

      .body {
        font-size: 16px;
        text-align: left;
        margin-bottom: 20px;
      }

      .label {
        font-weight: bold;
      }

      .support {
        font-size: 14px;
        color: #999999;
        margin-top: 20px;
        text-align: center;
      }

      a {
        color: #0000ee;
        text-decoration: underline;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <a href="https://studynotion-edtech-project.vercel.app">
        <img class="logo" src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo" />
      </a>
      <div class="message">New Instructor Contact Request</div>
      <div class="body">
        <p><span class="label">Name:</span> ${name}</p>
        <p><span class="label">Email:</span> ${email}</p>
        <p><span class="label">Domain:</span> ${domain}</p>
        <p><span class="label">Experience:</span> ${experience} years</p>
        ${
          linkedin
            ? `<p><span class="label">LinkedIn:</span> <a href="${linkedin}" target="_blank">${linkedin}</a></p>`
            : ""
        }
        ${
          portfolio
            ? `<p><span class="label">Portfolio:</span> <a href="${portfolio}" target="_blank">${portfolio}</a></p>`
            : ""
        }
        <p><span class="label">Message:</span><br/>${message}</p>
        ${
          resumeUrl
            ? `<p><span class="label">Resume:</span> <a href="${resumeUrl}" target="_blank">View Resume</a></p>`
            : "<p><span class='label'>Resume:</span> Not provided</p>"
        }
      </div>
      <div class="support">
        For any further discussion, please contact the instructor directly at
        <a href="mailto:${email}">${email}</a>.
      </div>
    </div>
  </body>
</html>`;
};
