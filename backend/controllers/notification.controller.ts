import NotificationModel from "../models/notification.model";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import cron from "node-cron";

// get all notification --- user specific and admin global
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query: any = {};
      if (req.user?.role === "admin") {
        query = { recipientRole: "admin" };
      } else {
        query = { userId: req.user?._id };
      }

      const notifications = await NotificationModel.find(query).sort({
        createdAt: -1, // new one at the top
      });
      res.status(200).json({
        success: true,
        notifications,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// update notification status
export const updateNotifications = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const notification = await NotificationModel.findById(req.params.id);
        
        if (!notification) {
            return next(new ErrorHandler('Notification not found', 404));
        }

        // Security: Ensure the user owns this notification OR is an admin marking an admin notification
        if (req.user?.role === "admin") {
          if (notification.recipientRole !== "admin") {
            return next(new ErrorHandler('Not authorized to update non-admin notifications', 403));
          }
        } else {
          if (String(notification.userId) !== String(req.user?._id)) {
            return next(new ErrorHandler('Not authorized to update this notification', 403));
          }
        }

        notification.status = 'read';
        await notification.save();

        // return updated list
        let query: any = {};
        if (req.user?.role === "admin") {
          query = { recipientRole: "admin" };
        } else {
          query = { userId: req.user?._id };
        }

        const notifications = await NotificationModel.find(query).sort({
            createdAt: -1,
        });

        res.status(200).json({
          success: true,
          notifications,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    }
  );

  // delete notification --- only admin
  cron.schedule("0 0 0 * * *", async()=>{
    const thirtyDaysago = new Date(Date.now() -30 * 24 *60 *60 * 1000 );
    await NotificationModel.deleteMany({status:"read", createdAt:{$lt: thirtyDaysago}});
    console.log("Deleted Read Notifications")
  });

