import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getCoursesAnalytics, getOrdersAnalytics, getUsersAnalytics } from "../controllers/analytics.controller";
import { updateAccessToken } from "../controllers/user.controller";
const analyticsRouter = express.Router();

// get user analytics -- only for admin
analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated,
  updateAccessToken,
  authorizeRoles("admin"),
  getUsersAnalytics
);
// get course analytics --- admin only
analyticsRouter.get(
  "/get-courses-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getCoursesAnalytics
);
// get order analytcs -- admin only
analyticsRouter.get(
  "/get-orders-analytics",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getOrdersAnalytics
);
 export default analyticsRouter;