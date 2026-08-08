import { RemoveImageFromCloudinary } from "../services.js";




const RemoveImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({
        success: false,
        message: "public_id is required",
        data: null,
        error: null,
      });
    }

    const response = await RemoveImageFromCloudinary(public_id);

    if (!response.success) {
      return res.status(500).json(response);
    }

    return res.status(200).json(response);
  }
   catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      error: error.message,
    });
  }
};



export { RemoveImage };