import mongoose from "mongoose";



const ConnectMongoDB = async()=>{
    try{
        const Connected = await mongoose.connect(process.env.MONGO_URI)
        console.log('✅ MongoDB connected successfully...')
    }
    catch(error){
        console.log('❌failed to connect to DB....',error)
    }
}


export default ConnectMongoDB