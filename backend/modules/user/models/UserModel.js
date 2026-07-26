import mongoose from "mongoose";



const AddressSchema = new mongoose.Schema(
    {
        country:{
            type: String,
            required: true,
            trim: true,
        },
        state:{
            type: String,
            required: true,
            trim: true,
        },
        city:{
            type: String,
            required: true,
            trim: true,
        },
        pinCode:{
            type: String,
            required: true,
            trim: true,
        },
        addressLine1:{
            type: String,
            required: true,
            trim: true,
        },
        addressLine2:{
            type: String,
            required: false,
            trim: true,
        },
        
    },
    {
        _id:false
    }
)


const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    roles:{
      type: [String],
      enum: ["buyer", "admin"],
      default: ["buyer"]
    },

    provider:{
      type: String,
      trim: true,
      enum: ["local", "google", "facebook", "github"],
      default: "local"
    },

    address:AddressSchema,

    profileImage: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
        type: Date,
        default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);