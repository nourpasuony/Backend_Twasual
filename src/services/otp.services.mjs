import otpGenerator from "otp-generator";
import OTP from '../Models/otp.model.mjs';
// import twilio from 'twilio';

// const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const generateOTP = () => {
    return otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        alphabets: false,
      });};

export const sendOTP = async (phone, otp) => {
    const message = await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone
    });
    return message;
};

export const saveOTP = async (phone, otp) => {
    const otpEntry = new OTP({
        phone,
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000) // OTP expires in 10 minutes
    });
    await otpEntry.save();
};

export const verifyOTP = async (phone, otp) => {
    const otpRecord = await OTP.findOne({ phone, otp });
    return otpRecord ? true : false;
};