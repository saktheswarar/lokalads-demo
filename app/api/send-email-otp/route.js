// File: /api/send-email-otp/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { storeEmailOtp } from '@/app/api/verify-otp/route';

export async function POST(req) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  storeEmailOtp(email, otp); // save to memory

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
