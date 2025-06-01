import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

export const sendWhatsAppOTP = async (to) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

  try {
    await client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: `whatsapp:${fromWhatsAppNumber}`,
      to: `whatsapp:${to}`
    });

    // Store OTP temporarily (in real-world, store in Redis or DB with expiry)
    // For now, you can associate it with the user in DB
    // Example: User.updateOne({ phone: to }, { otp })

    return { success: true, otp }; // Return OTP for testing, remove in production
  } catch (error) {
    console.error('WhatsApp OTP Error:', error);
    return { success: false };
  }
};
