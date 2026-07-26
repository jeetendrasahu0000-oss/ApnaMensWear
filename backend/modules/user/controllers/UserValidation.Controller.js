import { isEmailExists, isPhoneExists } from "../services/UserValidation.Services.js";


const isEmailExistsController = async (req,res) => {
  try{
    console.log('Hit isEmailExistsController Api...')
    const {email} = req.params
    const isExist = await isEmailExists(email)
    if(!isExist){
        return res.status(200).json({success:false,message:"email is not exixt",data:{exists:false},error:null})
    }
    return res.status(200).json({success:true,message:"email all ready exists",data:{exists:true},error:null})
  }
  catch(error){
    console.log('falied to handel isEmailExistsController ',error)
    return res.status(500).json({success:false,message:"internall server error",data:null,error:error.message})
  };
};



const isPhoneExistsController = async (req,res) => {
  try{
    console.log('Hit isPhoneExistsController Api...')
    const {phoneNo} = req.params
    const isExist = await isPhoneExists(phoneNo)
    if(!isExist){
        return res.status(200).json({success:false,message:"phone no is not exixt",data:{exists:false},error:null})
    }
    return res.status(200).json({success:true,message:"phone no all ready exists",data:{exists:true},error:null})
  }
  catch(error){
    console.log('falied to handel isPhoneExistsController ',error)
    return res.status(500).json({success:false,message:"internall server error",data:null,error:error.message})
  }
};

export {isEmailExistsController,isPhoneExistsController}