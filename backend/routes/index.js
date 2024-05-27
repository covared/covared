const express = require("express");
const nodemailer = require("nodemailer");
const { BreezedUser } = require("../models");
const { setAccessCookies } = require("../utils/cookies");
const { getReportWriterPrompt, sendPromptToGpt } = require("../utils/gptUtils");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ Hello: "World" });
});

router.get("/auth/status", async (req, res) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      return res.json({ isLoggedIn: false });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.json({
      isLoggedIn: true,
      email: payload.email,
      isSubscribedMonthly: payload.isSubscribedMonthly,
      isSubscribedLifetime: payload.isSubscribedLifetime,
    });
  } catch (err) {
    res.json({ isLoggedIn: false });
  }
});

router.post("/auth/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out" });
});

router.post("/send-email", async (req, res) => {
  const { email } = req.body;
  const lowerCaseEmail = email.toLowerCase();
  let user = await BreezedUser.findOne({ where: { email: lowerCaseEmail } });

  if (!user) {
    user = await BreezedUser.create({ email: lowerCaseEmail });
  }

  const verificationCode = Array(6)
    .fill(0)
    .map(() => Math.floor(Math.random() * 10))
    .join("");
  user.email_verification_code = verificationCode;

  console.log("verificationCode: ", verificationCode);
  await user.save();

  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  const mailOptions = {
    from: "info@breezed.co.uk",
    to: email,
    subject: "BreezEd Verification Email",
    html: `<html><body><p>Thank you for logging in. Your verification code is ${verificationCode}</p></body></html>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully." });
  } catch (error) {
    res.json({ message: `Error sending email: ${error.message}` });
  }
});

router.post("/send-code", async (req, res) => {
  const { email, code } = req.body;
  console.log(`in check_verification_code, code=${code}, email=${email}`);
  try {
    const user = await BreezedUser.findOne({ where: { email } });

    if (user && code === user.email_verification_code) {
      setAccessCookies(
        res,
        user.email,
        user.subscribed_monthly,
        user.subscribed_lifetime
      );
      user.logins += 1;
      await user.save();
      res.json({ success: true, message: "code matches" });
    } else {
      res.json({ success: false, message: "code does not match" });
    }
  } catch (error) {
    console.error(
      "some sort of error finding the user or setting access code",
      error
    );
    res.json({ success: false, message: "user not found" });
  }
});

router.post("/report-writer", async (req, res) => {
  const data = req.body;
  console.log(`in report writer, data=${JSON.stringify(data)}`);

  const { student_name, class_name, competencies, topics, email, use_gpt4 } =
    data;
  const user = await BreezedUser.findOne({ where: { email } });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (
    !user.subscribed_lifetime &&
    !user.subscribed_monthly &&
    user.api_calls >= 5
  ) {
    return res.json({
      report:
        "You have reached your limit of 5 better layouts, please subscribe",
    });
  }

  user.api_calls += 1;
  await user.save();

  setAccessCookies(
    res,
    email,
    user.subscribed_monthly,
    user.subscribed_lifetime
  );

  const system_prompt = getReportWriterPrompt(
    student_name,
    class_name,
    topics,
    competencies
  );
  try {
    const answer = await sendPromptToGpt(system_prompt, use_gpt4);
    res.json({ report: answer });
  } catch (error) {
    console.error("error generating report", error);
    res.json({ report: "Error generating report" });
  }
});

module.exports = router;
