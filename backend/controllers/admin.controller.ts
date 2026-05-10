import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErroHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";
import NotificationModel from "../models/notification.model";

// get admin dashboard stats
export const getAdminDashboardStats = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const totalUsers = await userModel.countDocuments();
      const totalCourses = await CourseModel.countDocuments();
      const totalOrders = await OrderModel.countDocuments();

      // Aggregate revenue
      const orders = await OrderModel.find();
      let totalRevenue = 0;
      let freeEnrollments = 0;
      let paidEnrollments = 0;

      orders.forEach((order: any) => {
        if (order.payment_info && (order.payment_info as any).amount) {
          totalRevenue += (order.payment_info as any).amount / 100; // Assuming amount is in cents
          paidEnrollments++;
        } else {
          freeEnrollments++;
        }
      });

      const recentUsers = await userModel.find().sort({ createdAt: -1 }).limit(5);
      const recentOrders = await OrderModel.find().sort({ createdAt: -1 }).limit(5);
      const recentNotifications = await NotificationModel.find().sort({ createdAt: -1 }).limit(5);

      res.status(200).json({
        success: true,
        stats: {
          totalUsers,
          totalCourses,
          totalOrders,
          totalRevenue,
          freeEnrollments,
          paidEnrollments,
        },
        recentUsers,
        recentOrders,
        recentNotifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get user by id
export const getAdminUserById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get user orders
export const getAdminUserOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await OrderModel.find({ userId: req.params.id });
      
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course students
export const getAdminCourseStudents = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await CourseModel.findById(req.params.id);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Find all orders for this course to get enrolled students
      const orders = await OrderModel.find({ courseId: req.params.id });
      const studentIds = orders.map(order => order.userId);
      
      const students = await userModel.find({ _id: { $in: studentIds } });

      res.status(200).json({
        success: true,
        students,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get order by id
export const getAdminOrderById = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const order = await OrderModel.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      const user = await userModel.findById(order.userId);
      const course = await CourseModel.findById(order.courseId);

      res.status(200).json({
        success: true,
        order,
        user,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
