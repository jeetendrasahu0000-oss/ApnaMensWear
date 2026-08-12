import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    currency: {
        type: String,
        default: "INR"
    },

    paymentMethod: {
        type: String,
        enum: ["ONLINE", "COD"],
        default: "ONLINE"
    },

    status: {
        type: String,
        enum: [
           "Pending", "Paid", "Failed", "Refunded"
        ],
        default: "PENDING"
    },

    razorpayOrderId: {
        type: String,
        required: true
    },

    razorpayPaymentId: {
        type: String
    },

    refundId: {
        type: String
    },

    paidAt: Date,

    refundedAt: Date

},
{
    timestamps: true
});



const PaymentModel = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default PaymentModel;