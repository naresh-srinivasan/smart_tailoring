// services/otpService.js
import MSG91 from "msg91-sms";

const authKey = "YOUR_MSG91_AUTH_KEY"; // get from MSG91 dashboard
const senderId = "SMARTT"; // approved sender id

const otpClient = new MSG91(authKey, senderId, "4"); // '4' = OTP template type

export const sendOTP = async (phone, otp) => {
  try {
    const response = await otpClient.sendOTP(phone, otp);
    return response; // MSG91 returns message id / status
  } catch (err) {
    console.error("MSG91 OTP Error:", err);
    throw err;
  }
};