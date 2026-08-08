import cloudinary from "../Config.js";
import { FOLDERS,UploadImageToCloudinary } from "../services.js";



const UploadImage = async (req,res) => {
  try {
    console.log('hit UploadImage api...')
    const { type } = req.params;

    const folder = FOLDERS[type?.toLowerCase()];

    if (!folder) {
      return res.status(400).json({
        success: false,
        message: "Invalid upload type",
        data:null,
        error:null,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
        data:null,
        error:null,
      });
    }

    const response = await UploadImageToCloudinary(
      req.file,
      folder
    );

    if (!response.success) {
        return res.status(500).json(response);
    }

    return res.status(200).json({
      success: true,
      message: "image uploaded successfully..",
      data: response.data,
      error:null
    });

  } 
  catch (error) {
    console.log("internall server error",error.message)
    return res.status(500).json({
      success: false,
      message: "internall server error",
      data: null,
      error:error.message
    });
  }
};




export {UploadImage}




// {
//     "success": true,
//     "message": "image uploaded successfully..",
//     "data": {
//         "url": "https://res.cloudinary.com/djvhmzqwj/image/upload/v1786010356/ApnaMensWear/products/olzkcqeaatb2wyjx0sv2.jpg",
//         "public_id": "ApnaMensWear/products/olzkcqeaatb2wyjx0sv2"
//     },
//     "error": null
// }


// {
//     "success": true,
//     "message": "image uploaded successfully..",
//     "data": {
//         "url": "https://res.cloudinary.com/djvhmzqwj/image/upload/v1786010356/ApnaMensWear/products/olzkcqeaatb2wyjx0sv2.jpg",
//         "public_id": "ApnaMensWear/products/olzkcqeaatb2wyjx0sv2"
//     },
//     "error": null
// }