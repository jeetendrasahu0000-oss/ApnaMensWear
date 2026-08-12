
import razorpay from "../Config/PaymentConfig.js";
import crypto from "crypto";
import PaymentModel from "../Model/PaymentModel.js";
import ProductModel from "../../products/models/ProductModel.js";
import OrderModel from "../../order/models/OrderModel.js";



const TestRazorpay = async (req, res) => {
  try {
    console.log('hit TestRazorpay api....')

    const order = await razorpay.orders.create({
      amount: 1000 * 100,
      currency: "INR",
      receipt: "test_receipt"
    });

    return res.json(order);

  } 
  catch (error) {

    console.log('failed to handel TestRazorpay ',error);

    return res.status(500).json({
      error: error.message
    });

  }
};


const CreateRazorpayOrder = async (req, res) => {
  try {

    console.log('Hit reateRazorpayOrder Api...')

    const userId = req.user.userId;
    const { products } = req.body;

    if (!products?.length) {
        console.log('Products are required not found ')
        return res.status(400).json({
            success: false,
            message: "Products are required",
            data:null,
            error:null
        });
    }

    let totalAmount = 0;

    for (const item of products) {
      const product = await ProductModel.findById(item.product._id);

      if (!product) {
        console.log('Product not found invalid product not found in db')
        return res.status(404).json({
            success: false,
            message: "Product not found",
            data:null,
            error:null
        });
      }

      const price = product.salePrice || product.price;

      totalAmount += price * item.quantity;
    }

    console.log("totalAmount =", totalAmount);
    console.log("amount sent to razorpay =", totalAmount * 100);

    console.log('Create a new order')

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log('Order created sucessfully')

    const payment = await PaymentModel.create({
      user: userId,
      amount: totalAmount,
      currency: "INR",
      paymentMethod: "ONLINE",
      status: "Pending",
      razorpayOrderId: razorpayOrder.id,
    });

    console.log('Payment info stored successfully in payment collection')

    return res.status(200).json({
        success: true,
        message: "Razorpay order created",
        data: {
            paymentId: payment._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        },
        error:null
    });
  } 
  catch (error) {
    console.error('failed to handel CreateRazorpayOrder ',error);

    return res.status(500).json({
        success: false,
        message: 'internall server error',
        data:null,
        error:error.message
    });
  }
};



const VerifyRazorpayPayment = async (req, res) => {
  try {

    console.log("Hit VerifyRazorpayPayment Api...");

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      console.log('Missing payment information')
      return res.status(400).json({
        success: false,
        message: "Missing payment information",
        data: {isVerified:false},
        error: null
      });
    }

    const payment = await PaymentModel.findOne({ razorpayOrderId: razorpay_order_id });

    if (!payment) {
      console.log('Payment record not found')
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
        data: {isVerified:false},
        error: null
      });
    }

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.log('Payment verification failed because signature not match')

      payment.status = "Failed";
      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
        data: {isVerified:false},
        error: null
      });
    }

    payment.status = "Paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.paidAt = new Date();
    await payment.save();

    console.log('payment verified info store in payment collection')


    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: {
        isVerified:true,
        paymentId: payment._id,
        orderId: payment.order || null
      },
      error: null
    });

  }
  catch (error) {
    console.error("Failed to verify payment",error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
      error: error.message
    });

  }
};


const CreateRefund = async (req, res) => {
  try {

    console.log('Hit CreateRefund api...')

    const { paymentId } = req.params;

    const payment = await PaymentModel.findById(paymentId);
    const order = await OrderModel.findOne({paymentId})

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not happen in pendding state",
        data:null,
        error:null
      });
    }
    if (payment.status === "Refunded") {
        return res.status(400).json({
            success: false,
            message: "Payment already refunded",
            data: null,
            error: null
        });
    }

    if(payment.status !== 'Paid'){
        return res.status(404).json({
        success: false,
        message: "Payment not happen in pendding state",
        data:null,
        error:null
      });
    }

    const refund = await razorpay.payments.refund(
      payment.razorpayPaymentId,
      {
        amount: payment.amount * 100
      }
    );

    payment.status = "Refunded";
    payment.refundId = refund.id;

    order.paymentStatus ='Refunded'

    await payment.save();
    await order.save();

    

    return res.status(200).json({
      success: true,
      message: "Refund created successfully",
      data: refund,
      error:null,
    });

  } 
  catch (error) {
    console.log('filed to handel CreateRefund ',error)

    return res.status(500).json({
      success: false,
      message: 'internall server error',
      data:null,
      error:error.message
    });

  }
};



export {TestRazorpay,CreateRazorpayOrder,VerifyRazorpayPayment,CreateRefund}