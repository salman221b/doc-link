// reminderSend/reminderSend.js
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const Appointment = require("../models/appointmentsModel"); // go up a folder

const startReminderJob = () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const fifteenMinutesLater = new Date(now.getTime() + 15 * 60000);

    const appointments = await Appointment.find({
      reminderSent: false,
      scheduledDate: {
        $gte: now,
        $lte: fifteenMinutesLater,
      },
    }).populate("patientId");

    for (const appointment of appointments) {
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: appointment.patientId.email,
        subject: "Appointment Reminder",
        text: `Dear ${
          appointment.patientId.firstName
        },\n\nThis is a reminder for your upcoming appointment with Dr. ${
          appointment.doctorId.firstName
        } at ${appointment.scheduledTime} on ${new Date(
          appointment.scheduledDate
        ).toDateString()}.\n\nRegards,\nDocLink`,
      };

      try {
        await transporter.sendMail(mailOptions);
        appointment.reminderSent = true;
        await appointment.save();
        console.log("Reminder sent to:", appointment.patientId.email);
      } catch (error) {
        console.error("Error sending reminder:", error);
      }
    }
  });
};

module.exports = startReminderJob;
