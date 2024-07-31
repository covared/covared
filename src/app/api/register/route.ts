// pages/api/register.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  const { name, email, schoolname, newdate, attendance, altdate, questions } = await req.json();

  // Setup the email transporter
  const transporter = nodemailer.createTransport({
    service: 'SendGrid', // or another email service
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY,
    }
  });


  const mailOptions = {
    from: process.env.INFO_EMAIL,
    to: process.env.CEO_EMAIL,
    subject: 'Event Registration',
    html: `<html><body><p>Name: ${name}</p><p>Email: ${email}</p><p>School Name: ${schoolname}</p><p>
           Questions: ${questions}</p><p>Attending: ${attendance}</p><p>Alternative: ${altdate}</p>
           <p>New Date: ${newdate}</p>
           </body></html>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully' 
    });
  } catch (error: any) {
    return NextResponse.json({
      message: `Error sending email: ${error.message}`, 
      status:500 
    });
  }
};

