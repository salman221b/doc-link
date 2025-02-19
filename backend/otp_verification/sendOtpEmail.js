const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

const sendOtpEmail = async (firstName, email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: email,
    subject: "Your OTP for Registration to DocLink.",
    text: `Dear ${firstName},\n Your OTP is: ${otp}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};
module.exports = { sendOtpEmail };
