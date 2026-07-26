import OtpModel from "../models/OtpModel.js";


export const setOtp = async (identifier,expiryInMinutes = 10) => {
  try {

    console.log(`try to set otp for identifier =${identifier}  expiryInMinutes ${expiryInMinutes}`)

    const expiresAt = new Date(Date.now() + expiryInMinutes * 60 * 1000);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OtpModel.findOneAndUpdate(
      { identifier },
      {
        otp,
        expiresAt,
      },
      {
        upsert: true,
        new: true,
      }
    );

    return {success:true,data:otp};
  } 
  catch (error) {
    console.error("Failed to set OTP:", error);
    return {success:false};
  }
};


export const verifyOtp = async (identifier,otp) => {
  try {

    console.log(`try to verify otp for identifier ${identifier} otp = ${otp}`)

    const otpRecord = await OtpModel.findOne({identifier,});

    if (!otpRecord) {
      return {success:false};;
    }

    if (otpRecord.expiresAt < new Date()) {
      await deleteOtp(identifier);
      return {success:false};
    }

    if (otpRecord.otp !== otp) {
      return {success:false};
    }

    return {success:true};
  } 
  catch (error) {
    console.error("Failed to verify OTP:", error);
    return {success:false};
  }
};


export const deleteOtp = async (identifier) => {
  try {

    console.log(`try to delete otp for identifier ${identifier}`)

    const result = await OtpModel.deleteOne({
      identifier,
    });

    return {success: result.deletedCount > 0};   
  } 
  catch (error) {
    console.error("Failed to delete OTP:", error);
    return {success:false};
  }
};



