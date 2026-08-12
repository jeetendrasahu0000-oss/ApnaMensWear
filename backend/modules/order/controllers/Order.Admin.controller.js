import { CreateShiprocketOrder } from "../../shiprocket/Services/CreateShiprocketOrder.js";
import OrderModel from "../models/OrderModel.js";
import UserModel from '../../user/models/UserModel.js'


/* ===========================
   GET ALL ORDERS
=========================== */

const GetAllOrders = async (req, res) => {
  try {
    console.log('Hit GetAllOrders Api.....')
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const orderStatus = req.query.orderStatus || "";
    const paymentStatus = req.query.paymentStatus || "";

    const query = {};

    if (search) {
      query.orderNumber = {
        $regex: search,
        $options: "i",
      };
    }

    if (orderStatus) {
      query.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const totalOrders = await OrderModel.countDocuments(query);

    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders,
        pagination: {
          totalOrders,
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
        },
      },
      error: null,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      data: null,
      error: error.message,
    });
  }
};

/* ===========================
   GET ORDER DETAILS
=========================== */

const GetOrderDetails = async (req, res) => {
  try {

    console.log('Hit GetOrderDetails Api.....')
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
        error: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
      error: null,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      data: null,
      error: error.message,
    });
  }
};

/* ===========================
   UPDATE ORDER STATUS
=========================== */

const UpdateOrderStatus = async (req, res) => {
  try {

    console.log('Hit UpdateOrderStatus Api.....')

    const { orderId } = req.params;
    const { orderStatus,dimensions } = req.body;

    console.log('dimention in update status ',dimensions)

    const allowedStatus = [
      "Pending",
      "Confirmed",
      "Packed",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ];

    if (!allowedStatus.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
        data: null,
        error: null,
      });
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
        error: null,
      });
    }

    const user =await UserModel.findById(order.user)
    // console.log('User=>',user)

    order.orderStatus = orderStatus;

    

    if(order.orderStatus === "Packed"){
      const response = await CreateShiprocketOrder({order,user,dimensions})
      console.log(response)
      if(response.success){
        if(!order.shipping) {order.shipping = {};}

         order.shipping.shiprocketOrderId = response.data.order_id || ""
         order.shipping.shipmentId=response.data.shipment_id || ""

         order.packageDimentionsDetails = dimensions
         
      }
    }

    await order.save();

    console.log('contniue')
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
      error: null,
    });
  } 
  catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      data: null,
      error: error.message,
    });
  }
};

/* ===========================

   UPDATE PAYMENT STATUS
=========================== */

const UpdatePaymentStatus = async (req, res) => {
  try {

    console.log('Hit UpdatePaymentStatus Api.....')

    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const allowedStatus = ["Pending", "Paid", "Failed", "Refunded"];

    if (!allowedStatus.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
        data: null,
        error: null,
      });
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
        error: null,
      });
    }

    order.paymentStatus = paymentStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
      error: null,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update payment status",
      data: null,
      error: error.message,
    });
  }
};

/* ===========================
   ORDER DASHBOARD STATS
=========================== */

const GetOrderDashboardStats = async (req, res) => {
  try {

    console.log('Hit GetOrderDashboardStats Api.....')


    const [
      totalOrders,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      revenue,
    ] = await Promise.all([
      OrderModel.countDocuments(),

      OrderModel.countDocuments({
        orderStatus: "Pending",
      }),

      OrderModel.countDocuments({
        orderStatus: "Confirmed",
      }),

      OrderModel.countDocuments({
        orderStatus: "Shipped",
      }),

      OrderModel.countDocuments({
        orderStatus: "Delivered",
      }),

      OrderModel.countDocuments({
        orderStatus: "Cancelled",
      }),

      OrderModel.aggregate([
        {
          $match: {
            orderStatus: {
              $ne: "Cancelled",
            },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalAmount",
            },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: revenue[0]?.totalRevenue || 0,
      },
      error: null,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      data: null,
      error: error.message,
    });
  }
};



export {GetAllOrders,GetOrderDetails,UpdateOrderStatus,UpdatePaymentStatus,GetOrderDashboardStats,}