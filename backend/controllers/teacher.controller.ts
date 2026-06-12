import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/ErroHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import CourseModel from "../models/course.model";
import OrderModel from "../models/order.model";
import userModel from "../models/user.model";
import NotificationModel from "../models/notification.model";
import StudentProgressModel from "../models/studentProgress.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const invalidateCourseCache = async (courseId?: string) => {
  await redis.del("allCourses");
  await redis.del("public:publishedCourses");
  if (courseId) {
    // The course detail cache key is always prefixed as `public:course:${courseId}`
    await redis.del(`public:course:${courseId}`);
  }

  // Rebuild allCourses cache
  const courses = await CourseModel.find().select(
    "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
  );
  await redis.set("allCourses", JSON.stringify(courses), "EX", 604800);
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const getTeacherDashboard = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = String(req.user?._id);

      // Own courses
      const ownCourses = await CourseModel.find({ teacherId });
      const courseIds = ownCourses.map((c) => String(c._id));

      // Orders for own courses
      const orders = await OrderModel.find({ courseId: { $in: courseIds } });

      // Unique students
      const studentIds = [...new Set(orders.map((o) => o.userId))];

      // Questions count across own courses
      let totalQuestions = 0;
      ownCourses.forEach((course: any) => {
        if (Array.isArray(course.courseData)) {
          course.courseData.forEach((cd: any) => {
            totalQuestions += cd.questions?.length || 0;
          });
        }
      });

      // Recent orders
      const recentOrders = await OrderModel.find({ courseId: { $in: courseIds } })
        .sort({ createdAt: -1 })
        .limit(5);

      res.status(200).json({
        success: true,
        stats: {
          totalCourses: ownCourses.length,
          totalOrders: orders.length,
          totalStudents: studentIds.length,
          totalQuestions,
        },
        recentOrders,
        courses: ownCourses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ─── Get Teacher's Own Courses ─────────────────────────────────────────────

export const getTeacherCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = String(req.user?._id);
      const courses = await CourseModel.find({ teacherId }).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        courses,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ─── Create Course (Teacher) ────────────────────────────────────────────────

export const createTeacherCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rawData = req.body;
      const data: any = {};

      const allowedFields = [
        "name",
        "description",
        "category",
        "price",
        "estimatedPrice",
        "tags",
        "level",
        "demoUrl",
        "benefits",
        "prerequisites",
        "courseData",
        "thumbnail",
        "slug",
        "language",
        "requirements",
        "whatYouWillLearn",
        "targetAudience",
        "courseTags",
        "duration",
        "previewVideoUrl",
      ];

      allowedFields.forEach((field) => {
        if (rawData[field] !== undefined) {
          data[field] = rawData[field];
        }
      });

      // Validate required fields
      if (!data.name) return next(new ErrorHandler("Name is required", 400));
      if (!data.description) return next(new ErrorHandler("Description is required", 400));
      if (!data.category) return next(new ErrorHandler("Category is required", 400));
      if (data.price === undefined || typeof data.price !== "number" || data.price < 0) {
        return next(new ErrorHandler("Price must be a number >= 0", 400));
      }
      if (!data.tags) return next(new ErrorHandler("Tags are required", 400));
      if (!data.level) return next(new ErrorHandler("Level is required", 400));
      if (!data.demoUrl) return next(new ErrorHandler("Demo URL is required", 400));
      if (!Array.isArray(data.courseData) || data.courseData.length === 0) {
        return next(new ErrorHandler("Course must contain at least one lesson", 400));
      }

      for (let i = 0; i < data.courseData.length; i++) {
        const lesson = data.courseData[i];
        if (!lesson.title || !lesson.description) {
           return next(new ErrorHandler("Every lesson must have a title and description", 400));
        }
      }

      // Set ownership
      data.teacherId = String(req.user?._id);
      data.createdBy = req.user?._id;

      // Set status
      data.status = "pending";

      // Handle thumbnail
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        if (typeof thumbnail === "string" && thumbnail.startsWith("http")) {
          data.thumbnail = { public_id: "external", url: thumbnail };
        } else if (
          process.env.CLOUD_NAME &&
          process.env.CLOUD_API_KEY &&
          process.env.CLOUD_SECRET_KEY
        ) {
          try {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
              folder: "courses",
            });
            data.thumbnail = { public_id: myCloud.public_id, url: myCloud.secure_url };
          } catch (cloudinaryErr) {
            console.error("Cloudinary upload failed, saving base64 directly to database:", cloudinaryErr);
            data.thumbnail = {
              public_id: "local_base64",
              url: thumbnail,
            };
          }
        } else {
          data.thumbnail = {
            public_id: "local_base64",
            url: thumbnail,
          };
        }
      }

      // Ensure courseData (lessons) use the correct link structure
      if (Array.isArray(data.courseData)) {
        data.courseData = data.courseData.map((cd: any) => ({
          ...cd,
          links: Array.isArray(cd.links)
            ? cd.links
                .filter((l: any) => l.title || l.url || l.link)
                .map((l: any) => ({
                  title: l.title || "",
                  url: l.url || l.link || "",
                }))
            : []
        }));
      }

      const course = await CourseModel.create(data);
      await invalidateCourseCache();

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      console.error("Course Creation Error:", error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ─── Edit Own Course ────────────────────────────────────────────────────────

export const editTeacherCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const teacherId = String(req.user?._id);
      const isAdmin = req.user?.role === "admin";

      const courseData = await CourseModel.findById(id) as any;
      if (!courseData) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Ownership check is already handled by middleware, but we keep it as a fallback
      if (!isAdmin && String(courseData.createdBy || courseData.teacherId) !== teacherId) {
        return next(new ErrorHandler("You can only edit your own courses", 403));
      }

      const rawData = req.body;
      
      // Sanitize data: only allow safe fields
      const data: any = {};
      const allowedFields = [
        "name", "description", "category", "price", "estimatedPrice", 
        "tags", "level", "demoUrl", "benefits", "prerequisites", 
        "courseData", "thumbnail", "slug", "language", "requirements", 
        "whatYouWillLearn", "targetAudience", "courseTags", "duration", 
        "previewVideoUrl"
      ];

      allowedFields.forEach(field => {
        if (rawData[field] !== undefined) {
          data[field] = rawData[field];
        }
      });

      if (data.name && !data.slug) {
        const baseSlug = data.name
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "") || "course";
        
        let slug = baseSlug;
        let counter = 1;
        while (await CourseModel.findOne({ slug, _id: { $ne: id } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        data.slug = slug;
      } else if (data.slug) {
        let slug = data.slug
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "") || "course";
        
        let baseSlug = slug;
        let counter = 1;
        while (await CourseModel.findOne({ slug, _id: { $ne: id } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }
        data.slug = slug;
      }

      // Handle thumbnail upload
      const thumbnail = data.thumbnail;
      if (thumbnail && typeof thumbnail === "string" && !thumbnail.startsWith("https")) {
        if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_SECRET_KEY) {
          try {
            if (courseData.thumbnail?.public_id && courseData.thumbnail.public_id !== "placeholder") {
              await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id).catch(() => {});
            }
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, { folder: "courses" });
            data.thumbnail = { public_id: myCloud.public_id, url: myCloud.secure_url };
          } catch (cloudinaryErr) {
            console.error("Cloudinary upload failed on edit, saving base64 directly to database:", cloudinaryErr);
            data.thumbnail = { public_id: "local_base64", url: thumbnail };
          }
        }
      } else if (thumbnail && typeof thumbnail === "string" && thumbnail.startsWith("https")) {
        data.thumbnail = { public_id: courseData?.thumbnail?.public_id || "placeholder", url: thumbnail };
      }

      // Ensure courseData (lessons) use the correct link structure
      if (Array.isArray(data.courseData)) {
        data.courseData = data.courseData.map((cd: any) => ({
          ...cd,
          links: Array.isArray(cd.links) 
            ? cd.links.map((l: any) => ({ title: l.title, url: l.url || l.link }))
            : []
        }));
      }

      // Auto-revert status to pending when teacher edits
      data.status = "pending";

      const updatedCourse = await CourseModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
      );

      await invalidateCourseCache(id);

      res.status(201).json({
        success: true,
        course: updatedCourse,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ─── Delete Own Course ──────────────────────────────────────────────────────

export const deleteTeacherCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const teacherId = String(req.user?._id);
      const isAdmin = req.user?.role === "admin";

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid course ID", 400));
      }

      const course = await CourseModel.findById(id) as any;
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (!isAdmin && String(course.teacherId) !== String(teacherId)) {
        return next(new ErrorHandler("You can only delete your own courses", 403));
      }

      // Soft delete
      course.isArchived = true;
      course.status = "archived";

      if (!course.approvalHistory) {
        course.approvalHistory = [];
      }
      course.approvalHistory.push({
        status: "archived",
        reason: "Soft deleted/archived by teacher",
        changedBy: req.user?.name || "teacher",
        changedAt: new Date(),
      });

      await course.save();
      await invalidateCourseCache(id);

      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// ─── Get Students for a Teacher's Course ───────────────────────────────────

export const getTeacherCourseStudents = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const teacherId = String(req.user?._id);
      const isAdmin = req.user?.role === "admin";

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid course ID", 400));
      }

      const course = await CourseModel.findById(id) as any;
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (!isAdmin && String(course.teacherId) !== String(teacherId)) {
        return next(new ErrorHandler("You can only view students of your own courses", 403));
      }

      const orders = await OrderModel.find({ courseId: id });
      const studentIds = orders.map((o) => o.userId);
      const students = await userModel.find({ _id: { $in: studentIds } });

      const progressRecords = await StudentProgressModel.find({
        userId: { $in: studentIds },
        courseId: id,
      });

      const totalLessons = course?.courseData?.length || 0;

      const enrichedStudents = students.map((student) => {
        const order = orders.find((o) => o.userId === String(student._id));
        const progress = progressRecords.find((p) => String(p.userId) === String(student._id));

        return {
          ...student.toObject(),
          orderStatus: order?.status || "unknown",
          enrolledAt: order?.enrolledAt || null,
          progress: progress || { completedLessons: [], progressPercentage: 0, totalLessons },
        };
      });

      res.status(200).json({
        success: true,
        students: enrichedStudents,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ─── Get Orders for Teacher's Courses ──────────────────────────────────────

export const getTeacherOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = String(req.user?._id);

      const ownCourses = await CourseModel.find({ teacherId });
      const courseIds = ownCourses.map((c) => String(c._id));

      const orders = await OrderModel.find({ courseId: { $in: courseIds } }).sort({
        createdAt: -1,
      });

      // Enrich with course name
      const enriched = orders.map((order: any) => {
        const course = ownCourses.find((c) => String(c._id) === String(order.courseId));
        return { ...order.toObject(), courseName: course?.name || "Unknown" };
      });

      res.status(200).json({
        success: true,
        orders: enriched,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ─── Get Questions Across Teacher's Courses ─────────────────────────────────

export const getTeacherQuestions = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = String(req.user?._id);

      const ownCourses = await CourseModel.find({ teacherId });

      const allQuestions: any[] = [];
      ownCourses.forEach((course: any) => {
        if (Array.isArray(course.courseData)) {
          course.courseData.forEach((cd: any) => {
            if (Array.isArray(cd.questions)) {
              cd.questions.forEach((q: any) => {
                allQuestions.push({
                  ...q.toObject ? q.toObject() : q,
                  courseId: String(course._id),
                  courseName: course.name,
                  contentId: String(cd._id),
                  contentTitle: cd.title,
                });
              });
            }
          });
        }
      });

      // Sort newest first
      allQuestions.sort((a, b) => {
        const da = a._id?.toString() || "";
        const db = b._id?.toString() || "";
        return db.localeCompare(da);
      });

      res.status(200).json({
        success: true,
        questions: allQuestions,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ─── Answer a Question ──────────────────────────────────────────────────────

export const addTeacherAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { questionId } = req.params;
      const { answer, courseId, contentId } = req.body;
      const teacherId = String(req.user?._id);
      const isAdmin = req.user?.role === "admin";

      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid course ID", 400));
      }

      const course = await CourseModel.findById(courseId) as any;
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Ownership check
      if (!isAdmin && course.teacherId !== teacherId) {
        return next(new ErrorHandler("You can only answer questions in your own courses", 403));
      }

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content ID", 400));
      }

      const courseContent = course.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }

      const question = courseContent.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler("Question not found", 404));
      }

      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionReplies.push(newAnswer);
      await course.save();

      // Notify question author
      try {
        await NotificationModel.create({
          user: question.user._id,
          title: "Your Question Was Answered",
          message: `${req.user?.name} answered your question on "${courseContent.title}"`,
        });
      } catch (notifErr: any) {
        console.warn("Notification failed:", notifErr.message);
      }

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
