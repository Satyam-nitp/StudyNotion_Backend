
exports.courseEnrollmentEmail = (courseName, name) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Enrollment Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #4CAF50;
        }
        p {
            font-size: 16px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to ${courseName}</h1>
        <p>Dear ${name},</p>
        <p>Thank you for enrolling in the course "${courseName}". We are excited to have you on board!</p>
        <p>If you have any questions, feel free to reach out.</p>
        <p>Best regards,</p>
        <p>The Course Team</p>
    </div>
</body>
</html>
`
}