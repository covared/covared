// pages/api/register.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, event } = await req.json();

  // Setup the email transporter
  const transporter = nodemailer.createTransport({
    service: 'SendGrid', // or another email service
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
    }
  });


  const mailOptions = {
    from: "info@springsverse.co.uk",   //process.env.EMAIL_FROM,
    to: "qasimbabatunde@gmail.com",  //"y.rasheedah@springsverse.co.uk",
    subject: 'Event Registration',
    html: `<html><body><p>Name: ${name}\nEmail: ${email}\nEvent: ${event}</p></body></html>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Error sending email', error, status:500 });
  }
};

