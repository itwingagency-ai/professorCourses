import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import CourseModel from "../models/course.model";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService } from "../services/order.services";
import mongoose from "mongoose";
import { redis } from "../utils/redis";

// Stripe is kept for future paid courses but NOT required for free enrollment
let stripe: any = null;
try {
  if (
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY !== "sk_test_dummy"
  ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Stripe = require("stripe");
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
} catch {
  // Stripe not configured – free enrollment still works fine
}

// ─── Create Order / Free Enrollment ─────────────────────────────────────────

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

      // Prevent non-student roles from enrolling
      const userRole = req.user?.role;
      const effectiveRole = userRole === "user" ? "student" : userRole;
      if (effectiveRole !== "student") {
        return next(
          new ErrorHandler("Only students can enroll in courses", 403)
        );
      }

      const user = await userModel.findById(req.user?._id);

      if (!user) {
        return next(
          new ErrorHandler("User not found. Please login again.", 404)
        );
      }

      const course = await CourseModel.findOne({
        _id: courseId,
        status: "published",
      });

      if (!course) {
        return next(
          new ErrorHandler(
            "Course not found or not available for enrollment",
            404
          )
        );
      }

      const alreadyEnrolled = user.courses?.some(
        (c: any) => String(c.courseId || c._id || c) === String(courseId)
      );

      if (alreadyEnrolled) {
        return next(
          new ErrorHandler("You are already enrolled in this course", 400)
        );
      }

      // Determine free vs paid (paid = Stripe, coming later)
      const isFree =
        course.price === 0 ||
        !payment_info ||
        (payment_info as any)?.type === "free-enrollment";

      const enrollmentType: "free" | "paid" = isFree ? "free" : "paid";

      const normalizedPaymentInfo = isFree
        ? {
            type: "free_enrollment",
            status: "not_required",
            provider: "none",
            note: "Payment disabled for MVP. Stripe will be integrated later.",
          }
        : payment_info;

      const orderData: any = {
        courseId: String(course._id),
        userId: String(user._id),
        payment_info: normalizedPaymentInfo,
        status: "active",
        enrollmentType,
        enrolledAt: new Date(),
      };

      const order = await OrderModel.create(orderData);

      // Push course into user's course list
      user.courses.push({
        courseId: String(course._id),
        name: course.name,
        title: course.name,
        thumbnail: course.thumbnail,
        purchasedAt: new Date(),
      });

      await user.save();

      // Increment purchased counter
      course.purchased = (course.purchased || 0) + 1;
      await course.save();

      // Notification to Teacher
      await NotificationModel.create({
        userId: course.teacherId,
        type: "course_enrollment",
        title: "New Student Enrollment",
        message: `${user.name} has enrolled in your course "${course.name}"`,
        link: `/teacher/students`, // Assuming there's a students page
      });

      // Refresh user in Redis
      await redis.set(String(user._id), JSON.stringify(user), "EX", 604800);

      // Invalidate course caches so enrollment count is fresh everywhere
      await redis.del("allCourses");
      await redis.del("public:publishedCourses");
      await redis.del(`public:course:${courseId}`);

      // Send confirmation email (non-blocking)
      try {
        const mailData = {
          user: { name: user.name, email: user.email },
          order: {
            _id: String(course._id).slice(0, 6),
            name: course.name,
            price: course.price,
            enrollmentType,
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
            subject:
              enrollmentType === "free"
                ? "Free Course Enrollment Confirmed"
                : "Order Confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (emailError: any) {
        console.warn("Enrollment email failed:", emailError?.message);
      }

      // Email to Teacher (non-blocking)
      try {
        const teacher = await userModel.findById(course.teacherId);
        if (teacher && process.env.SMTP_HOST && process.env.SMTP_USER) {
          await sendMail({
            email: teacher.email,
            subject: "New Student Enrollment!",
            template: "course-enrollment.ejs",
            data: {
              teacherName: teacher.name,
              studentName: user.name,
              courseName: course.name,
            },
          });
        }
      } catch (teacherEmailError: any) {
        console.warn("Teacher enrollment email failed:", teacherEmailError?.message);
      }

      // Create in-app notification for Student (non-blocking)
      try {
        await NotificationModel.create({
          userId: user._id,
          type: "course_enrollment",
          title: "Course Enrollment",
          message: `You have successfully enrolled in ${course.name}`,
          link: `/course-access/${course._id}`,
        });
      } catch (notificationError: any) {
        console.warn(
          "Enrollment notification failed:",
          notificationError?.message
        );
      }

      return res.status(201).json({
        success: true,
        message:
          enrollmentType === "free"
            ? "You have successfully enrolled in this course!"
            : "Course enrollment successful!",
        order,
        course,
        user,
        enrollmentType,
        enrollmentStatus: "active",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Get Enrollment Status ───────────────────────────────────────────────────
// GET /api/v1/enrollment-status/:courseId
// Returns whether the authenticated user is enrolled and their enrollment details.

export const getEnrollmentStatus = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid course ID", 400));
      }

      const userId = String(req.user?._id);

      // Fast check from Redis-backed user record
      const isEnrolledInUserRecord = req.user?.courses?.some(
        (c: any) => String(c.courseId || c._id || c) === courseId
      );

      // Also check the Order collection for rich enrollment metadata
      const order = await OrderModel.findOne({ userId, courseId }).sort({
        createdAt: -1,
      });

      return res.status(200).json({
        success: true,
        isEnrolled: !!(isEnrolledInUserRecord || order),
        enrollmentStatus:
          order?.status || (isEnrolledInUserRecord ? "active" : null),
        enrollmentType:
          order?.enrollmentType || (isEnrolledInUserRecord ? "free" : null),
        enrolledAt: order?.enrolledAt || null,
        orderId: order?._id || null,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ─── Update Enrollment Status (Admin) ───────────────────────────────────────
// PATCH /api/v1/orders/:orderId/status

export const updateEnrollmentStatus = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const validStatuses = ["active", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return next(
          new ErrorHandler(
            "Invalid status. Must be active, completed, or cancelled",
            400
          )
        );
      }

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return next(new ErrorHandler("Invalid order ID", 400));
      }

      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );

      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }

      return res.status(200).json({
        success: true,
        message: `Enrollment status updated to ${status}`,
        order,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ─── Get All Orders (Admin) ──────────────────────────────────────────────────

export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Stripe Publishable Key ──────────────────────────────────────────────────

export const sendStripePublishableKey = CatchAsyncError(
  async (req: Request, res: Response) => {
    res.status(200).json({
      publishablekey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    });
  }
);

// ─── Create Payment Intent (Future Stripe) ───────────────────────────────────

export const newPayment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!stripe) {
        return next(
          new ErrorHandler(
            "Payment processing is not configured yet. Please use free enrollment.",
            503
          )
        );
      }

      const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "USD",
        metadata: { company: "3S Consultant" },
        automatic_payment_methods: { enabled: true },
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
