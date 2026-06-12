import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  getAdminDashboardStats,
  getAdminUserById,
  getAdminUserOrders,
  getAdminCourseStudents,
  getAdminOrderById,
  getAuditLogs,
} from "../controllers/admin.controller";
import { updateAccessToken } from "../controllers/user.controller";

const adminRouter = express.Router();

adminRouter.get(
  "/dashboard",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminDashboardStats
);

adminRouter.get(
  "/users/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminUserById
);

adminRouter.get(
  "/users/:id/orders",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminUserOrders
);

adminRouter.get(
  "/courses/:id/students",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminCourseStudents
);

adminRouter.get(
  "/orders/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminOrderById
);

adminRouter.get(
  "/audit-logs",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAuditLogs
);

export default adminRouter;
