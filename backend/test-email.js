require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      service: process.env.SMTP_SERVICE,
      auth:{
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
      },
  });

  try {
    console.log("Attempting to send email...");
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Test Email",
      text: "Testing email from LMS"
    });
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Email failed:", err);
  }
}

testEmail();
