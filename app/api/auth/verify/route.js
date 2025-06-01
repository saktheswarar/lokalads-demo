import connectDB from '@/config/database';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();
  const { phone, otp } = await req.json();

  try {
    const user = await User.findOne({ phone });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 });
    }

    user.isVerified = true;
    user.otp = null; // clear OTP
    await user.save();

    return NextResponse.json({ message: 'OTP verified. User activated.' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
