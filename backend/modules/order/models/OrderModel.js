import mongoose from "mongoose";


const ShippingSchema = new mongoose.Schema({
  shiprocketOrderId: {
    type: Number,
    default: null
  },

  shipmentId: {
    type: Number,
    default: null
  }
}, { _id: false });


const PackageSchema = new mongoose.Schema(
  {
    length: {
      type: Number,
      default: null,
    },

    breadth: {
      type: Number,
      default: null,
    },

    height: {
      type: Number,
      default: null,
    },

    weight: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);



const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
    //   ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    coverImage: {
      url: String,
      public_id: String,
    },

    selectedVariant: {
      color: String,
      size: String,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    priceAtPurchase: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
      required: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
    },

    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      postalCode: String,
      country: {
        type: String,
        default: "India",
      },
    },

    subtotal: {
      type: Number,
      required: true,
    },

    shippingCharge: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required:true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned",
      ],
      default: "Pending",
    },

    orderNumber: {
      type: String,
      unique: true,
      required: true,
    },

    placedAt: {
      type: Date,
      default: Date.now,
    },

    shipping: {
      type: ShippingSchema,
      default: () => ({})
    },

    packageDimentionsDetails: {
      type: PackageSchema,
      default: () => ({})
    },
    
  },

  {
    timestamps: true,
  }
);



export default mongoose.model("Order", OrderSchema);