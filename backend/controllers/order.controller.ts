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
import { getAllOrdersService } from "../services/order.services";
import mongoose from "mongoose";
import { redis } from "../utils/redis";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const getPurchasedCourseId = (course: any): string | null => {
  if (!course) return null;

  if (typeof course === "string") {
    return course;
  }

  if (course.courseId) {
    if (typeof course.courseId === "string") {
      return course.courseId;
    }

    if (course.courseId._id) {
      return course.courseId._id.toString();
    }

    return course.courseId.toString();
  }

  if (course._id) {
    return course._id.toString();
  }

  if (course.id) {
    return course.id.toString();
  }

  return null;
};

const normalizeId = (id: any): string => {
  return id?.toString ? id.toString() : String(id);
};

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      if (!courseId) {
        return next(new ErrorHandler("Course ID is required", 400));
      }

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid course ID", 400));
      }

      if (payment_info && "id" in payment_info) {
        const paymentIntentId = payment_info.id;
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId as string
        );

        if (paymentIntent.status !== "succeeded") {
          return next(new ErrorHandler("Payment not authorized!", 400));
        }
      }

      const user = await userModel.findById(req.user?._id);

      if (!user) {
        return next(new ErrorHandler("User not found. Please login again.", 404));
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const normalizedCourseId = normalizeId(courseId);

      const courseExistInUser = user.courses?.some((userCourse: any) => {
        const purchasedId = getPurchasedCourseId(userCourse);
        return purchasedId === normalizedCourseId;
      });

      if (courseExistInUser) {
        return res.status(200).json({
          success: true,
          alreadyPurchased: true,
          message: "You have already purchased this course",
          course,
          user,
        });
      }

      const orderData: any = {
        courseId: String(course._id),
        userId: String(user._id),
        payment_info: payment_info || {
          type: "local-mock",
          status: "success",
        },
      };

      const order = await OrderModel.create(orderData);

      user.courses.push({
        courseId: String(course._id),
        name: course.name,
        title: course.name,
        thumbnail: course.thumbnail,
        purchasedAt: new Date(),
      });

      await user.save();

      course.purchased = course.purchased ? course.purchased + 1 : 1;
      await course.save();

      await redis.set(String(user._id), JSON.stringify(user), "EX", 604800);

      try {
        const mailData = {
          user: {
            name: user.name,
            email: user.email,
          },
          order: {
            _id: String(course._id).slice(0, 6),
            name: course.name,
            price: course.price,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          },
        };

        if (
          process.env.SMTP_HOST &&
          process.env.SMTP_USER &&
          process.env.SMTP_PASSWORD
        ) {
          await sendMail({
            email: user.email,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        } else {
          console.log("SMTP not configured. Skipping order confirmation email.");
        }
      } catch (emailError: any) {
        console.warn(
          "Order created successfully, but email failed:",
          emailError?.message
        );
      }

      try {
        await NotificationModel.create({
          user: user._id,
          title: "New Order",
          message: `You have a new order from ${course.name}`,
        });
      } catch (notificationError: any) {
        console.warn(
          "Order created successfully, but notification failed:",
          notificationError?.message
        );
      }

      return res.status(201).json({
        success: true,
        message: "Course enrolled successfully",
        order,
        course,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// send stripe publishble key
export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

// new payment
export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: {
          company: "3S Consultant",
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        success: true,
        client_secret: myPayment.client_secret,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
