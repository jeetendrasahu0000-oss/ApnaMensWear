import bcrypt from "bcrypt";
import UserModel from "../models/UserModel.js";
import {isEmailExists,isPhoneExists,} from "../services/UserValidation.Services.js";
import jwt from 'jsonwebtoken'
import { verifyOtp } from "../../../Services/OptServices.js";


const userSignup = async (req,res) => {
  try {
    console.log("Hit registerController Api...");

    const commingData = req.body

    const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "password",
        "address",
        "profileImage",
    ]
    const requiredFieldsInAddress =[
        "country",
        "state",
        "city",
        "pinCode",
        "addressLine1",
        "addressLine2",
    ]

    const missingFields = requiredFields.filter((item)=>{
        return commingData[item] === undefined ||
               commingData[item] === null ||
               commingData[item] === ""
    })

    let addressMissingFields = []
    if(commingData.address){
        addressMissingFields = requiredFieldsInAddress.filter((item)=>{
            return commingData.address[item] === undefined ||
                commingData.address[item] === null ||
                commingData.address[item] === ""
        }).map((item)=>`address.${item}`)
    }

    missingFields.push(...addressMissingFields)

    if(missingFields.length >0){
        return res.status(400).json({success:false,message:"required fields missing",data:null,error:missingFields})
    }


    // Email format
    const emailRegex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(commingData.email)) {
      return res.status(400).json({success: false,message: "Invalid email format",data: null,error: null,});
    }
    
    const emailExists =await isEmailExists(commingData.email);
    if (emailExists) {
      return res.status(409).json({success: false,message:"Email already registered",data: null,error: null,});
    }

    const phoneExists = await isPhoneExists(commingData.phone);
    if (phoneExists) {
        return res.status(409).json({success: false,message:"Phone number already registered",data: null,error: null,});
    }

    if (commingData.password.length < 8) {
      return res.status(400).json({success: false,message:"Password must be at least 8 characters",data: null,error: null,});
    }

    const isOtpVerifyed = verifyOtp(commingData.phone,commingData.otp)
    if(!isOtpVerifyed){
      return res.status(400).json({success: false,message:"otp not verified",data:{verified:false},error: null,});
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(commingData.password, 10);

    // Create user
    const user = await UserModel.create({
      firstName : commingData.firstName,
      lastName : commingData.lastName,
      email : commingData.email,
      password: hashedPassword,
      phone : commingData.phone,
      address : commingData.address,
      profileImage : commingData.profileImage,
    });

    // Remove sensitive fields
    const userResponse = user.toObject();

    delete userResponse.password;
    delete userResponse.refreshToken;

    return res.status(201).json({
      success: true,
      message:"User registered successfully",
      data: userResponse,
      error: null,
    });
  } 
  catch (error) {
    console.error("Failed to handle registerController:",error);

    return res.status(500).json({
      success: false,
      message:"Internal server error",
      data: null,
      error: error.message,
    });
  }
};



const userLogin = async (req,res) => {
  try {
    console.log("Hit userLogin Api...");

    const commingData = req.body

    const requiredFields = [
        "identifier" ,
        "password",
    ]

    const missingFields = requiredFields.filter((item)=>{
        return commingData[item] === undefined ||
               commingData[item] === null ||
               commingData[item] === ""
    })

    if(missingFields.length >0){
        return res.status(400).json({success:false,message:"required fields missing",data:null,error:missingFields})
    }

    const user = await UserModel.findOne({
        $or: [
            { email: commingData.identifier.toLowerCase() },
            { phone: commingData.identifier }
        ]
    });

    if(!user){
      return res.status(400).json({success:false,message:"User Not Found",data:null,error:"USER_NOT_EXIST"})

    }

    if (commingData.password.length < 8) {
      return res.status(400).json({success: false,message:"Password must be at least 8 characters",data: null,error: null,});
    }

    const verifiedPassword = await bcrypt.compare(commingData.password,user.password)

    if (!verifiedPassword) {
      return res.status(401).json({success: false,message: "Invalid credentials",data:null,error:"INVALID_CREDENTIALS"});
    }


    const RefreshToken = jwt.sign(
      {
        userId:user._id,
        email:user.email,
        phone:user.phone,
        roles: user.roles
      },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn:'7d'
      }
    )

    const AccessToken = jwt.sign(
      {
        userId:user._id,
        email:user.email,
        phone:user.phone,
        roles: user.roles
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn:'1000m'
      }
    )

    res.cookie("RefreshToken",RefreshToken,
      {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        // sameSite:"strict",
        sameSite:"none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    )




    // Update user login info 
    const UpdatedUser = await UserModel.findOneAndUpdate(
      {
        email:user.email
      },
      {
        lastLogin:new Date(),
        isActive:true,
        refreshToken:RefreshToken
      },
      {
        new:true
      }
  );

    // Remove sensitive fields
    const userResponse = UpdatedUser.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    console.log('user login succesfully...')

    return res.status(201).json({
      success: true,
      message:"User login successfully",
      data: {userResponse,AccessToken},
      error: null,
    });


  } 
  catch (error) {
    console.error("Failed to handle userLogin:",error);

    return res.status(500).json({
      success: false,
      message:"Internal server error",
      data: null,
      error: error.message,
    });
  }
};





const refreshAccessToken = async (req,res) => {
  try {
    console.log("Hit refreshAccessToken Api...");

    const UserRefreshToken = req.cookies.RefreshToken

    if(!UserRefreshToken){
      console.log('Refresh token missing')
      return res.status(401).json({success:false,message:"Refresh token missing",data:null,error:"REFRESHTOKEN_MISSING"})
    }

    const decodedToken = jwt.verify(UserRefreshToken,process.env.JWT_REFRESH_TOKEN_SECRET)

    console.log('decodedToken => ',decodedToken)

    const user = await UserModel.findById(decodedToken.userId)

    if(!user){
      console.log('User Not Found')
      return res.status(400).json({success:false,message:"User Not Found",data:null,error:"USER_NOT_EXIST"})
    }

    if(user.refreshToken !== UserRefreshToken){
      console.log("Refresh token is invalid or has been revoked")
      res.clearCookie("RefreshToken");
      return res.status(401).json({success:false,message:"Refresh token is invalid or has been revoked",data:null,error:"REFRESH_TOKEN_REVOKED"})
    }

    const RefreshToken = jwt.sign(
      {
        userId:user._id,
        email:user.email,
        phone:user.phone,
        roles: user.roles
      },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn:'7d'
      }
    )

    const AccessToken = jwt.sign(
      {
        userId:user._id,
        email:user.email,
        phone:user.phone,
        roles: user.roles
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn:'10m'
      }
    )

    const UpdatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        refreshToken:RefreshToken
      },
    );


    res.cookie("RefreshToken",RefreshToken,
      {
        httpOnly:true,
        secure:process.env.NODE_ENV === "production",
        // sameSite:"strict",
        sameSite:"none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }
    )

    console.log("Access and refresh tokens rotated successfully...")

    return res.status(200).json({
      success: true,
      message:"Access and refresh tokens rotated successfully",
      data: {AccessToken},
      error: null,
    });


  } 
  catch (error) {
    console.error("Failed to handle refreshAccessToken",error);

    if (error.name === "TokenExpiredError" ||error.name === "JsonWebTokenError") {
      console.log("Invalid or expired refresh token")
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
        data: null,
        error: "INVALID_REFRESH_TOKEN",
      });
    }

    return res.status(500).json({
      success: false,
      message:"Internal server error",
      data: null,
      error: error.message,
    });
  }
};



export {userSignup,userLogin,refreshAccessToken}