// File: /api/send-otp/route.js

import { NextResponse } from 'next/server';
import twilio from 'twilio';

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export async function POST(req) {
  const { phone } = await req.json();

  if (!phone) {
    return NextResponse.json({ message: 'Phone number is required' }, { status: 400 });
  }

  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications.create({
        to: `+${phone}`,
        channel: 'sms', // Changed from 'whatsapp' to 'sms'
      });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
