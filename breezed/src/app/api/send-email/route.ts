import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

import { pool } from "@/utils/database";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({
      success: false,
      message: "missing email",
    });
  }

  const lowerCaseEmail = email.toLowerCase();
  const client = await pool.connect();

  try {
    let userResult = await client.query(
      "SELECT * FROM breezed_users WHERE email = $1",
      [lowerCaseEmail]
    );
    let user = userResult.rows[0];

    if (!user) {
      await client.query("INSERT INTO breezed_users (email) VALUES ($1)", [
        lowerCaseEmail,
      ]);
      userResult = await client.query(
        "SELECT * FROM breezed_users WHERE email = $1",
        [lowerCaseEmail]
      );
      user = userResult.rows[0];
    }

    const verificationCode = Array(6)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
      .join("");

    await client.query(
      "UPDATE breezed_users SET email_verification_code = $1 WHERE email = $2",
      [verificationCode, lowerCaseEmail]
    );

    console.log("verificationCode: ", verificationCode);

    const transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
      },
    });

    const mailOptions = {
      from: "info@covared.com",
      to: email,
      subject: "BreezEd Verification Email",
      html: `<html><body><p>Thank you for logging in. Your verification code is ${verificationCode}</p></body></html>`,
    };

    try {
      await transporter.sendMail(mailOptions);
      return NextResponse.json({ message: "Email sent successfully." });
    } catch (error: any) {
      return NextResponse.json({
        message: `Error sending email: ${error.message}`,
      });
    }
  } catch (error) {
    console.error("Error handling database operation: ", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
