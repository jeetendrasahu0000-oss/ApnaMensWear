import mongoose from "mongoose";



const variants = new mongoose.Schema(
    {
        color: {
            type: String,
            required: true,
            trim: true,
        },
        size: {
            type: String,
            required: true,
            trim: true,
        },
        stock: {
            type: Number,
            required: true,
            trim: true,
        },
    },
)



const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  }, 
  { 
    _id: false 
  }
);


const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
    },

    shortDescription: {
      type: String,
    },

    description: {
      type: String,
    },

    category: {
      type: String,
    },

    subCategory: {
      type: String,
    },

    brand: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
      default: 0,
    },

    weight: String,

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    variants: [variants],

    coverImage:{
      type:ImageSchema,
      required:true
    },
    images:[ImageSchema],

    tags: [String],

    
    isActive: {
      type: Boolean,
      default: true,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);