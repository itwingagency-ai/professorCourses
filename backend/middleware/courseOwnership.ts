import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import CourseModel from "../models/course.model";
import mongoose from "mongoose";

/**
 * Middleware to verify if the logged-in user (teacher) owns the course.
 * Admins are allowed to bypass this check.
 */
export const authorizeTeacherCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const courseId = req.params.id || req.body.courseId;
    const userId = req.user?._id;
    const userRole = req.user?.role;

    if (!courseId) {
      return next(new ErrorHandler("Course ID is required", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return next(new ErrorHandler("Invalid course ID", 400));
    }

    const course = await CourseModel.findById(courseId);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    // Admin bypass
    if (userRole === "admin") {
      return next();
    }

    // Ownership check
    // We check both createdBy (ObjectId) and teacherId (string) for compatibility
    const isOwner = 
      (course.createdBy && String(course.createdBy) === String(userId)) ||
      (course.teacherId && String(course.teacherId) === String(userId));

    if (!isOwner) {
      return next(
        new ErrorHandler("You do not have permission to access this course", 403)
      );
    }

    next();
  }
);
