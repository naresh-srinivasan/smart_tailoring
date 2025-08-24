// mailer.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host : "smtp.gmail.com",
  post : 465,
  secure : false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) console.log("Transporter Error:", error);
  else console.log("Server is ready to send emails:", success);
});

export const sendContactEmail = async ({ name, email, phone, query }) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: "say.naresh135@gmail.com",
    subject: `Contact Form Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nQuery: ${query}`,
  });
};

export const sendResetEmail = async (to, token) => {
  const resetURL = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Reset Your Password",
    html: `<p>Click <a href="${resetURL}">here</a> to reset your password. Token valid for 1 hour.</p>`
  });
};

export const sendOtpEmail = async (to, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Your Delivery OTP",
    html: `<p>Your OTP for order delivery is: <strong>${otp}</strong></p>
           <p>Do not share this OTP with anyone.</p>`
  });
};
