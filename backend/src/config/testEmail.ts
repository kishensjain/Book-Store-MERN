import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
// dotenv.config({path:'../.env'});
dotenv.config({ path: "../../.env" });
console.log({ user: process.env.SMTP_USER, pass: process.env.SMTP_PASS });


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // or your email provider's SMTP
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const testEmail = async () => {
  try {
    await transporter.sendMail({
      from: `"Test E-Commerce" <${process.env.SMTP_USER}>`,
      to: "jain.skishen@gmail.com", // replace with your email
      subject: "SMTP Test Email",
      html: "<h2>This is a test email from your backend!</h2>",
    });
    console.log("✅ Test email sent successfully!");
  } catch (err) {
    console.error("❌ Error sending test email:", err);
  }
};

testEmail();
