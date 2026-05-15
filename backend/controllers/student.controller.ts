import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import StudentProgressModel from "../models/studentProgress.model";
import OrderModel from "../models/order.model";
import CourseModel from "../models/course.model";

// 1. Get Student Dashboard
export const getStudentDashboard = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) return next(new ErrorHandler("User not found", 404));

      const enrolledCourses = user.courses || [];
      const courseIds = enrolledCourses.map((c: any) => c.courseId);

      // Fetch progress
      const progressDocs = await StudentProgressModel.find({
        userId: user._id,
        courseId: { $in: courseIds },
      });

      let completedCourses = 0;
      let inProgressCourses = 0;

      const progressByCourse = progressDocs.reduce((acc: any, doc) => {
        acc[doc.courseId.toString()] = doc;
        if (doc.progressPercentage === 100) {
          completedCourses++;
        } else if (doc.progressPercentage > 0) {
          inProgressCourses++;
        }
        return acc;
      }, {});

      // Recent Courses
      const recentCourses = [...enrolledCourses]
        .sort((a, b) => new Date(b.purchasedAt || 0).getTime() - new Date(a.purchasedAt || 0).getTime())
        .slice(0, 5);

      // Recent Orders
      const recentOrders = await OrderModel.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(5);

      res.status(200).json({
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          },
          totalEnrolledCourses: enrolledCourses.length,
          inProgressCourses,
          completedCourses,
          enrolledCourses,
          recentCourses,
          recentOrders,
          progressByCourse,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// 2. Get Student Orders
export const getStudentOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orders = await OrderModel.find({ userId: req.user?._id }).sort({ createdAt: -1 });

      const orderData = await Promise.all(
        orders.map(async (order) => {
          const course = await CourseModel.findById(order.courseId).select("name title");
          return {
            _id: order._id,
            courseId: order.courseId,
            courseName: (course as any)?.name || (course as any)?.title || "Unknown Course",
            amount: (order.payment_info as any)?.amount || 0,
            paymentType: (order.payment_info as any)?.type || "local-mock",
            status: (order.payment_info as any)?.status || "Completed",
            createdAt: (order as any).createdAt,
          };
        })
      );

      res.status(200).json({
        success: true,
        orders: orderData,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// 3. Get Student Questions
export const getStudentQuestions = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) return next(new ErrorHandler("User not found", 404));

      const courseIds = (user.courses || []).map((c: any) => c.courseId);
      const courses = await CourseModel.find({ _id: { $in: courseIds } });

      const studentQuestions: any[] = [];

      courses.forEach((course) => {
        course.courseData.forEach((lesson: any) => {
          lesson.questions.forEach((question: any) => {
            if (question.user && question.user._id?.toString() === user._id?.toString()) {
              studentQuestions.push({
                courseId: course._id,
                courseName: course.name,
                lessonId: lesson._id,
                lessonTitle: lesson.title,
                questionId: question._id,
                question: question.question,
                questionReplies: question.questionReplies || [],
                createdAt: question.createdAt || new Date(),
              });
            }
          });
        });
      });

      studentQuestions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.status(200).json({
        success: true,
        questions: studentQuestions,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Helper to verify enrollment
const verifyEnrollment = (user: any, courseId: string) => {
  if (!user || !user.courses) return false;
  return user.courses.some((c: any) => c.courseId.toString() === courseId.toString());
};

// 4. Get Student Progress
export const getStudentProgress = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId } = req.params;
      const user = req.user;

      if (!verifyEnrollment(user, courseId)) {
        return next(new ErrorHandler("You are not enrolled in this course", 403));
      }

      let progress = await StudentProgressModel.findOne({
        userId: user?._id,
        courseId,
      });

      if (!progress) {
        progress = await StudentProgressModel.create({
          userId: user?._id,
          courseId,
          completedLessons: [],
          progressPercentage: 0,
        });
      }

      res.status(200).json({
        success: true,
        progress,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// 5. Mark Lesson Complete
export const markLessonComplete = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, lessonId } = req.body;
      const user = req.user;

      if (!courseId || !lessonId) {
        return next(new ErrorHandler("Course ID and Lesson ID are required", 400));
      }

      if (!verifyEnrollment(user, courseId)) {
        return next(new ErrorHandler("You are not enrolled in this course", 403));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) return next(new ErrorHandler("Course not found", 404));

      // NEW VALIDATION: Check if lessonId exists in courseData
      const validLesson = course.courseData.find(
        (lesson: any) => lesson._id.toString() === lessonId.toString()
      );
      if (!validLesson) {
        return next(new ErrorHandler("Invalid lesson ID", 400));
      }

      const totalLessons = course.courseData.length;
      if (totalLessons === 0) return next(new ErrorHandler("Course has no lessons", 400));

      let progress = await StudentProgressModel.findOne({
        userId: user?._id,
        courseId,
      });

      if (!progress) {
        progress = new StudentProgressModel({
          userId: user?._id,
          courseId,
          completedLessons: [],
          progressPercentage: 0,
        });
      }

      const alreadyCompleted = progress.completedLessons.some((l) => l.lessonId === lessonId);

      if (!alreadyCompleted) {
        progress.completedLessons.push({ lessonId, completedAt: new Date() });
        const percent = Math.round((progress.completedLessons.length / totalLessons) * 100);
        progress.progressPercentage = percent > 100 ? 100 : percent;
        await progress.save();
      }

      res.status(200).json({
        success: true,
        progress,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// 6. Save Last Lesson
export const saveLastLesson = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, lessonId } = req.body;
      const user = req.user;

      if (!courseId || !lessonId) {
        return next(new ErrorHandler("Course ID and Lesson ID are required", 400));
      }

      if (!verifyEnrollment(user, courseId)) {
        return next(new ErrorHandler("You are not enrolled in this course", 403));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) return next(new ErrorHandler("Course not found", 404));

      // NEW VALIDATION: Check if lessonId exists in courseData
      const validLesson = course.courseData.find(
        (lesson: any) => lesson._id.toString() === lessonId.toString()
      );
      if (!validLesson) {
        return next(new ErrorHandler("Invalid lesson ID", 400));
      }

      let progress = await StudentProgressModel.findOne({
        userId: user?._id,
        courseId,
      });

      if (!progress) {
        progress = new StudentProgressModel({
          userId: user?._id,
          courseId,
          completedLessons: [],
          progressPercentage: 0,
          lastLessonId: lessonId,
        });
        await progress.save();
      } else {
        progress.lastLessonId = lessonId;
        await progress.save();
      }

      res.status(200).json({
        success: true,
        progress,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
