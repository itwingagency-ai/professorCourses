import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.services";
import mongoose from "mongoose";

// create order

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info, userId } = req.body as IOrder;
      const user = await userModel.findById(req.user?._id);
      const courseExistInUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );

      if (courseExistInUser) {
        return next(
          new ErrorHandler("you have already purchased this course", 400)
        );
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("course not found", 404));
      }

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        user: {
          name: req.user?.name, // Assuming req.user contains the logged-in user's details
          email: req.user?.email, // Assuming req.user contains the logged-in user's email
        },
        order: {
          // _id : course._id.slice(0,6),
          // _id : course._id.toString().slice(0,6),
          _id: (course._id as mongoose.Types.ObjectId).toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { user: mailData.user, order: mailData.order }
      );
      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
      // add course to the user dashboard
      // user?.courses.push(course?._id);
      (user?.courses as unknown as string[]).push(course?._id as string);
      await user?.save();

      // send notification
      await NotificationModel.create({
        user: user?._id,
        title: " New Order",
        message: `You have a new order from ${course?.name} `,
      });
      //   course.purchased ? course.purchased +=1: course.purchased;
      course.purchased = course.purchased ? course.purchased + 1 : 1;

      await course.save();
      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// get all orders --- only for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
