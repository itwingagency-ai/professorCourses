import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter =express.Router();
// create order
orderRouter.post("/create-order", updateAccessToken,isAuthenticated, createOrder);
// get all orders --- only for admin
orderRouter.get("/get-orders",updateAccessToken, isAuthenticated,authorizeRoles("admin"), getAllOrders);
export default orderRouter;