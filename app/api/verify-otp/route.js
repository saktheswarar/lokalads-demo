// File: /api/verify-otp/route.js
import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const emailOtps = new Map(); // email => otp (mock)

export async function POST(req) {
  const { type, destination, otp } = await req.json();

  try {
    if (type === 'phone') {
      const verificationCheck = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SID)
        .verificationChecks.create({
          to: destination,
          code: otp,
        });

      if (verificationCheck.status === 'approved') {
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
      }
    }

    if (type === 'email') {
      const storedOtp = emailOtps.get(destination);
      if (storedOtp === otp) {
        emailOtps.delete(destination);
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ success: false, message: 'Invalid Email OTP' }, { status: 400 });
      }
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export function storeEmailOtp(email, otp) {
  emailOtps.set(email, otp);
}
