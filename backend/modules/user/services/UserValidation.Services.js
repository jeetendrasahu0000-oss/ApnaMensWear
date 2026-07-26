

import UserModel from "../models/UserModel.js";



export const isEmailExists = async (email) => {
  return await UserModel.exists({ email });
};

export const isPhoneExists = async (phone) => {
  return await UserModel.exists({ phone });
};

export const getUserByEmail = async (email) => {
  return await UserModel.findOne({ email });
};

export const getUserByPhone = async (phone) => {
  return await UserModel.findOne({ phone });
};

export const getUserById = async (userId) => {
  return await UserModel.findById(userId);
};



export const updateRefreshToken = async (userId,refreshToken) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    {
      refreshToken,
    },
    {
      new: true,
    }
  );
};

export const updateLastLogin = async (userId) => {
  return await UserModel.findByIdAndUpdate(
    userId,
    {
      lastLogin: new Date(),
    },
    {
      new: true,
    }
  );
};

