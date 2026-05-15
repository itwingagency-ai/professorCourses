import express from "express";
import { authorizeRoles, isAuthenticated, authorizeStudent } from "../middleware/auth";
import { createOrder, getAllOrders, newPayment, sendStripePublishableKey } from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter =express.Router();
// create order
orderRouter.post("/create-order", updateAccessToken,isAuthenticated, authorizeStudent, createOrder);
// get all orders --- only for admin
orderRouter.get("/get-orders",updateAccessToken, isAuthenticated,authorizeRoles("admin"), getAllOrders);

orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);
orderRouter.post("/payment", isAuthenticated, newPayment);

export default orderRouter;