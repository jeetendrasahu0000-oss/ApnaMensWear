import { setOtp, verifyOtp } from "../Services/OptServices.js"

const setOtpController = async (req,res) =>{
    try{
        console.log(`Hit setOtpController Api....`)
        const {identifier,expireTime} = req.body

        if (!identifier) {
            return res.status(400).json({success: false,message: "Identifier is required",data: null,error: null, });
        }

        const isOtpSet = await setOtp(identifier,expireTime)
        if(!isOtpSet.success){
            return res.status(200).json({success:false,message:"falied to set otp",data:null,error:null})
        }
        return res.status(200).json({success:true,message:"set otp successfully",data:isOtpSet.data,error:null})
    }
    catch(error){
        console.log('failed to handel ',error)
        return res.status(500).json({success:false,message:"internall server error",data:null,error:error.message})
    }
}


const verifyOtpController = async (req,res) =>{
    try{
        console.log(`Hit  verifyOtpController Api....`)
        const {identifier,otp} = req.body

        if (!identifier) {
            return res.status(400).json({success: false,message: "Identifier is required",data: null,error: null, });
        }
        if (!otp) {
            return res.status(400).json({success: false,message: "otp is required",data: null,error: null, });
        }

        const isOtpVerified = await verifyOtp(identifier,otp)

        if(!isOtpVerified.success){
            return res.status(200).json({success:false,message:"falied to varified otp",data:{verified:false},error:null})
        }

        return res.status(200).json({success:true,message:"opt verified successfully",data:{verified:true},error:null})
    }
    catch(error){
        console.log('failed to handel ',error)
        return res.status(500).json({success:false,message:"internall server error",data:{verified:false},error:error.message})
    }
}





export {setOtpController,verifyOtpController}
