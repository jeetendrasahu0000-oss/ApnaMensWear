console.log('this file is running ')


import { v2 as cloudinary } from "cloudinary";
if(process.env.CLOUDINARY_CLOUD_NAME){
    console.log('name fetchend successfully ')
}
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key:", process.env.CLOUDINARY_API_KEY);
console.log("API Secret Exists:", !!process.env.CLOUDINARY_API_SECRET);


cloudinary.config({
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;