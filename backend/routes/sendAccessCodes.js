import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const correctPins = ['1234', '5678', '91011', '121314', '151617'];

router.post('/sendAccessCodes', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Set up Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., Gmail
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Access Codes',
    text: `Here are your access codes: ${correctPins.join(', ')}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Access codes sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send access codes' });
  }
});

export default router;
