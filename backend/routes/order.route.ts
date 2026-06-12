import express from "express";
import {
  authorizeRoles,
  isAuthenticated,
  authorizeStudent,
} from "../middleware/auth";
import {
  createOrder,
  getAllOrders,
  getEnrollmentStatus,
  updateEnrollmentStatus,
  newPayment,
  sendStripePublishableKey,
} from "../controllers/order.controller";
import { updateAccessToken } from "../controllers/user.controller";

const orderRouter = express.Router();

// ─── Enrollment ──────────────────────────────────────────────────────────────

// POST  /api/v1/create-order   → student enrolls in a free course
orderRouter.post(
  "/create-order",
  updateAccessToken,
  isAuthenticated,
  authorizeStudent,
  createOrder
);

// GET   /api/v1/enrollment-status/:courseId   → check if student is enrolled
orderRouter.get(
  "/enrollment-status/:courseId",
  updateAccessToken,
  isAuthenticated,
  getEnrollmentStatus
);

// ─── Admin ───────────────────────────────────────────────────────────────────

// GET   /api/v1/get-orders     → admin: all orders
orderRouter.get(
  "/get-orders",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

// PATCH /api/v1/orders/:orderId/status  → admin: update enrollment status
orderRouter.patch(
  "/orders/:orderId/status",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  updateEnrollmentStatus
);

// ─── Stripe (future) ─────────────────────────────────────────────────────────

orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);
orderRouter.post("/payment", isAuthenticated, newPayment);

export default orderRouter;