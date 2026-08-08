import express from "express";

import { Authontication, Authorization } from "../../user/middleware/AuthMiddleware.js";
import { CreateOrder, GetOrders } from "../controllers/Order.Controller.js";
import { GetAllOrders, GetOrderDashboardStats, GetOrderDetails, UpdateOrderStatus, UpdatePaymentStatus } from "../controllers/Order.Admin.controller.js";

const orderRoutes = express.Router();

orderRoutes.post("/create",Authontication,Authorization(['buyer']),CreateOrder);
orderRoutes.get('/',Authontication,Authorization(['buyer']),GetOrders)

/* Admin Routes */

orderRoutes.get("/admin",Authontication,Authorization(["buyer","admin"]),GetAllOrders);
orderRoutes.get("/admin/:orderId",Authontication,Authorization(["buyer","admin"]),GetOrderDetails);
orderRoutes.get("/admin/stats",Authontication,Authorization(["buyer","admin"]),GetOrderDashboardStats);

orderRoutes.post("/admin/status/:orderId",Authontication,Authorization(["buyer","admin"]),UpdateOrderStatus);
orderRoutes.post("/admin/payment-status/:orderId",Authontication,Authorization(["buyer","admin"]),UpdatePaymentStatus);

// http://localhost:5000/api/v1/order/create

export default orderRoutes;