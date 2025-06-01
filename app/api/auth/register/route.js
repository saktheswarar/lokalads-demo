import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/config/database';
import User from '@/models/User';
import { storeEmailOtp } from '@/app/api/verify-otp/route';

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const {
    firstName,
    lastName,
    dob,
    email,
    phone,
    password,
    otpPhone,
    otpEmail,
  } = body;

  if (!firstName || !lastName || !dob || !email || !phone || !password || !otpPhone || !otpEmail) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
  if (existingUser) {
    return NextResponse.json({ message: 'User already exists' }, { status: 409 });
  }

  // Verify Phone OTP (Twilio)
  const verifyPhone = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-otp`, {
    method: 'POST',
    body: JSON.stringify({ type: 'phone', destination: `+${phone}`, otp: otpPhone }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!verifyPhone.ok) {
    const error = await verifyPhone.json();
    return NextResponse.json({ message: `Phone OTP Error: ${error.message}` }, { status: 400 });
  }

  // Verify Email OTP (local mock)
  const verifyEmail = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-otp`, {
    method: 'POST',
    body: JSON.stringify({ type: 'email', destination: email, otp: otpEmail }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!verifyEmail.ok) {
    const error = await verifyEmail.json();
    return NextResponse.json({ message: `Email OTP Error: ${error.message}` }, { status: 400 });
  }

  // Create user
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    dob,
    email,
    phone,
    password: hashedPassword,
  });

  await user.save();

  return NextResponse.json({ message: 'User registered successfully' });
}
