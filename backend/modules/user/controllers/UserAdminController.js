import UserModel from "../models/UserModel.js";


export const GetAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
      .select("-password -refreshToken")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
      error: null,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      data: null,
      error: error.message,
    });
  }
};


export const GetSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await UserModel.findById(userId)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        error: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
      error: null,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      data: null,
      error: error.message,
    });
  }
};


export const UpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      firstName,
      lastName,
      email,
      phone,
      roles,
      isActive,
      address,
      profileImage,
    } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        phone,
        roles,
        isActive,
        address,
        profileImage,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        error: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
      error: null,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user",
      data: null,
      error: error.message,
    });
  }
};


export const DeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await UserModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        error: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
      error: null,
    });
  } 
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
      data: null,
      error: error.message,
    });
  }
};