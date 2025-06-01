import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/config/database';
import User from '@/models/User';

export async function POST(req) {
  await connectDB();
  const { emailOrPhone, password } = await req.json();

  if (!emailOrPhone || !password) {
    return NextResponse.json({ message: 'Email/Phone and password are required' }, { status: 400 });
  }

  const user = await User.findOne({
    $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
  });

  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  return NextResponse.json({
    message: 'Login successful',
    user: {
      id: user._id,
      name: user.firstName + ' ' + user.lastName,
      email: user.email,
      phone: user.phone,
    },
  });
}
