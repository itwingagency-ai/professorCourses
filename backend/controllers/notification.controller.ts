import NotificationModel from "../models/notification.model";
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import cron from "node-cron";
// get all notification --- only for admin
export const getNotifications = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await NotificationModel.find().sort({
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
// update notification status --- only for admin
export const updateNotifications = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
         const  notification = await NotificationModel.findById(req.params.id);
        
        if (!notification) {
            return next(new ErrorHandler('Notification not found', 404));
        } else{
            notification.status ? notification.status = 'read': notification.status;
        } 
        await notification.save();
        // for our fronend status update
        const notifications = await NotificationModel.find().sort({
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

  // testing cron
  // cron.schedule("*/5 * * * * *", function(){
  //   console.log("running a task every 5 seconds");
  //   console.log("-------------");
  // })

  // delete notification --- only admin
  cron.schedule("0 0 0 * * *", async()=>{
    // ("running a task every day at 12:00 AM");
    const thirtyDaysago = new Date(Date.now() -30 * 24 *60 *60 * 1000 );
    await NotificationModel.deleteMany({status:"read", createdAt:{$lt: thirtyDaysago}});
    console.log("Deleted Read Notifications")
  });
