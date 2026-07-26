import jwt from 'jsonwebtoken'

const Authontication = (req,res,next)=>{
    try{
        console.log('Hit Authontication Middleware...')

        const AuthHeader = req.headers.authorization
        if(!AuthHeader?.startsWith('Bearer ')){
            return res.status(401).json({success:false,message:"AccessToken Missing",data:null,error:"ACCESS_TOKEN_MISSING"})
        }

        const AccessToken = AuthHeader.split(" ")[1]
        console.log("AccessToken => ",AccessToken)
       
        const decodedAccessToken = jwt.verify(AccessToken,process.env.JWT_ACCESS_TOKEN_SECRET)

        req.user = {
            userId:decodedAccessToken.userId,
            email:decodedAccessToken.email,
            phone:decodedAccessToken.phone,
            roles:decodedAccessToken.roles,
        }

        return next()


    }
    catch(error){
        console.log('failed to pass Authontication Middleware...')

        if (error.name === "TokenExpiredError" ||error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired AccessToken",
                data: null,
                error: "INVALID_ACCESS_TOKEN",
            });
        }

        return res.status(500).json({
            success: false,
            message:"Internal server error",
            data: null,
            error: error.message,
        });
    }
}


const Authorization = (AllowedRoles)=>{
    return (req,res,next)=>{
        try{
            console.log('hit Authorization Middleware...')
            
            const hasRole = req.user.roles.some(role => AllowedRoles.includes(role));

            if (!hasRole) {
                return res.status(403).json({
                    success: false,
                    message: "Access denied",
                    data: null,
                    error: "FORBIDDEN"
                });
            }
            return next()
        }
        catch(error){
            console.log('failed to pass Authorization Middleware...')
            return res.status(500).json({ 
                success: false,
                message:"Internal server error",
                data: null,
                error: error.message,
            });
        }
    }

}


export {Authontication,Authorization}

