// pages/api/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  const { name, email, event } = req.body;

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
    to: "y.rasheedah@springsverse.co.uk",
    subject: 'Event Registration',
    text: `Name: ${name}\nEmail: ${email}\nEvent: ${event}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending email', error });
  }
};

export default handler;
