import { transporter } from "../config/nodemailer.js";

export const sendVerificationEmail = async (to: string, token: string) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"E-Commerce App" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verify your email",
    html: `
      <h2>Welcome to Our Store 🎉</h2>
      <p>Click below to verify your email:</p>
      <a href="${verificationUrl}" style="color: blue; text-decoration: underline;">
        Verify Email
      </a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
