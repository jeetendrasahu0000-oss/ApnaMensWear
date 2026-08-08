import cloudinary from "./Config.js";




const FOLDERS = {
  product: "ApnaMensWear/products",
  profile: "ApnaMensWear/profiles",
  category: "ApnaMensWear/categories",
  banner: "ApnaMensWear/banners",
  brand: "ApnaMensWear/brands",
};


const UploadImageToCloudinary = async (file,folder) => {

  try{
    const fileBase64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(
        fileBase64,
        {
        folder,
        resource_type: "image",
        }
    );

    return {
       success:true,
        message:"successfully upload image to cloudinery",
        data:{
            url: result.secure_url,
            public_id: result.public_id,
        },
        error:null,
    };
  } 
  catch(error){
    return {
        success:false,
        message:"failed to upload image to cloudinery",
        data:null,
        error:error.message,
    }
  }
};



const RemoveImageFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(
      public_id
    );

    console.log(result)

    return {
      success: true,
      message: "Image removed successfully",
      data: result,
      error: null,
    };
  } 
  catch (error) {
    return {
      success: false,
      message: "Failed to remove image",
      data: null,
      error: error.message,
    };
  }
};






export {FOLDERS,UploadImageToCloudinary,RemoveImageFromCloudinary}