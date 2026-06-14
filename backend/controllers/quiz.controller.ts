import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import { QuizModel, QuizAttemptModel } from "../models/quiz.model";
import CourseModel from "../models/course.model";
import { isStudentEnrolled } from "../utils/enrollment";
import { isStudentRole } from "../models/user.model";
import NotificationModel from "../models/notification.model";
import AdminAuditLogModel from "../models/auditLog.model";

// Teacher creates a quiz
export const createQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, title, description, questions, passingMarks } = req.body;
      const teacherId = req.user?._id;

      if (!title || title.trim() === "") {
        return next(new ErrorHandler("Quiz title is required", 400));
      }
      if (!questions || !Array.isArray(questions) || questions.length === 0) {
        return next(new ErrorHandler("Quiz must have at least one question", 400));
      }

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.text || q.text.trim() === "") {
          return next(new ErrorHandler(`Question ${i + 1} text is required`, 400));
        }
        if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
          return next(new ErrorHandler(`Question ${i + 1} must have at least two options`, 400));
        }
        for (let j = 0; j < q.options.length; j++) {
          if (!q.options[j] || q.options[j].trim() === "") {
            return next(new ErrorHandler(`Question ${i + 1} option ${j + 1} cannot be empty`, 400));
          }
        }
        if (typeof q.correctOptionIndex !== "number" || q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) {
          return next(new ErrorHandler(`Question ${i + 1} has an invalid correctOptionIndex`, 400));
        }
      }

      if (typeof passingMarks !== "number" || passingMarks < 1 || passingMarks > 100) {
        return next(new ErrorHandler("passingMarks must be between 1 and 100", 400));
      }

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      if (course.teacherId?.toString() !== teacherId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to manage this course", 403));
      }

      const quiz = await QuizModel.create({
        courseId,
        title,
        description,
        questions,
        passingMarks,
        createdBy: teacherId,
      });

      res.status(201).json({ success: true, quiz });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get quizzes for a course (Student/Teacher)
export const getQuizzesByCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.courseId;
      const filter: any = { courseId };
      if (req.user?.role === "student" || req.user?.role === "user") {
        filter.isArchived = { $ne: true };
      }
      const quizzes = await QuizModel.find(filter).lean();

      if (isStudentRole(req.user?.role)) {
        if (!req.user?._id) return next(new ErrorHandler("User ID not found", 400));
        const enrolled = await isStudentEnrolled(req.user._id as string, courseId);
        if (!enrolled) {
          return next(new ErrorHandler("You must be enrolled in this course to view its quizzes", 403));
        }
      }

      // If student, remove correctOptionIndex
      if (req.user?.role !== "admin") {
        const course = await CourseModel.findById(courseId);
        const isTeacher = course?.teacherId?.toString() === req.user?._id?.toString();
        
        if (!isTeacher) {
          quizzes.forEach((quiz: any) => {
            if (quiz.questions && Array.isArray(quiz.questions)) {
              quiz.questions.forEach((q: any) => {
                delete q.correctOptionIndex;
              });
            }
          });
        }
      }

      res.status(200).json({ success: true, quizzes });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Student submits quiz attempt
export const submitQuizAttempt = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!isStudentRole(req.user?.role)) {
        return next(new ErrorHandler("Only students can submit quiz attempts", 403));
      }

      const quizId = req.params.quizId;
      const { responses } = req.body; // [{questionId, selectedOptionIndex}]
      const userId = req.user?._id;
      
      if (!userId) return next(new ErrorHandler("User ID not found", 400));

      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return next(new ErrorHandler("Quiz not found", 404));
      }
      if (quiz.isArchived) {
        return next(new ErrorHandler("This quiz is archived and cannot be attempted", 400));
      }

      const enrolled = await isStudentEnrolled(userId as string, quiz.courseId.toString());
      if (!enrolled) {
        return next(new ErrorHandler("You must be enrolled in this course to submit an attempt", 403));
      }

      if (!responses || !Array.isArray(responses)) {
        return next(new ErrorHandler("Responses array is required", 400));
      }

      if (quiz.questions.length === 0) {
        return next(new ErrorHandler("This quiz has no questions, cannot be attempted", 400));
      }

      let score = 0;
      const gradedResponses = responses.map((r: any) => {
        const question = quiz.questions.find((q: any) => q._id.toString() === r.questionId?.toString());
        if (!question) {
          throw new ErrorHandler(`Invalid questionId: ${r.questionId}`, 400);
        }
        if (typeof r.selectedOptionIndex !== "number" || r.selectedOptionIndex < 0 || r.selectedOptionIndex >= question.options.length) {
          throw new ErrorHandler(`Invalid selectedOptionIndex for question: ${r.questionId}`, 400);
        }
        if (question.correctOptionIndex === r.selectedOptionIndex) {
          score += 1;
        }
        return {
          questionId: r.questionId,
          selectedOptionIndex: r.selectedOptionIndex,
        };
      });

      const percentage = (score / quiz.questions.length) * 100;
      const passed = percentage >= quiz.passingMarks;

      const attempt = await QuizAttemptModel.create({
        quizId,
        userId,
        courseId: quiz.courseId,
        score: percentage,
        passed,
        responses: gradedResponses,
      });

      // Notification
      try {
        await NotificationModel.create({
          userId,
          recipientRole: "student",
          type: "quiz_submitted",
          title: "Quiz Result",
          message: `You scored ${percentage}% on "${quiz.title}". ${passed ? 'Passed!' : 'Failed.'}`,
          link: `/course-access/${quiz.courseId}`,
        });
      } catch (e) {
        console.warn("Failed to notify student of quiz result");
      }

      res.status(201).json({ success: true, attempt });
    } catch (error: any) {
      if (error instanceof ErrorHandler) return next(error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get attempt history
export const getQuizAttempts = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const userId = req.user?._id;
      const attempts = await QuizAttemptModel.find({ quizId, userId }).sort({ createdAt: -1 });

      res.status(200).json({ success: true, attempts });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Teacher/Admin gets all attempts for a quiz
export const getAllAttemptsForQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const requesterId = req.user?._id;

      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return next(new ErrorHandler("Quiz not found", 404));
      }

      const course = await CourseModel.findById(quiz.courseId);
      if (course?.teacherId?.toString() !== requesterId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to view attempts for this quiz", 403));
      }

      const attempts = await QuizAttemptModel.find({ quizId })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });

      res.status(200).json({ success: true, attempts });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Teacher edits a quiz
export const editQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const { title, description, questions, passingMarks } = req.body;
      const teacherId = req.user?._id;

      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return next(new ErrorHandler("Quiz not found", 404));
      }

      const course = await CourseModel.findById(quiz.courseId);
      if (course?.teacherId?.toString() !== teacherId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to manage this quiz", 403));
      }

      if (title !== undefined) {
        if (title.trim() === "") return next(new ErrorHandler("Quiz title cannot be empty", 400));
        quiz.title = title;
      }
      if (description !== undefined) {
        quiz.description = description;
      }
      if (passingMarks !== undefined) {
        if (typeof passingMarks !== "number" || passingMarks < 1 || passingMarks > 100) {
          return next(new ErrorHandler("passingMarks must be between 1 and 100", 400));
        }
        quiz.passingMarks = passingMarks;
      }
      if (questions !== undefined) {
        if (!Array.isArray(questions) || questions.length === 0) {
          return next(new ErrorHandler("Quiz must have at least one question", 400));
        }
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          if (!q.text || q.text.trim() === "") return next(new ErrorHandler(`Question ${i + 1} text is required`, 400));
          if (!q.options || !Array.isArray(q.options) || q.options.length < 2) return next(new ErrorHandler(`Question ${i + 1} must have at least two options`, 400));
          for (let j = 0; j < q.options.length; j++) {
            if (!q.options[j] || q.options[j].trim() === "") return next(new ErrorHandler(`Question ${i + 1} option ${j + 1} cannot be empty`, 400));
          }
          if (typeof q.correctOptionIndex !== "number" || q.correctOptionIndex < 0 || q.correctOptionIndex >= q.options.length) {
            return next(new ErrorHandler(`Question ${i + 1} has an invalid correctOptionIndex`, 400));
          }
        }
        quiz.questions = questions;
      }

      await quiz.save();

      res.status(200).json({ success: true, quiz });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Teacher deletes a quiz
export const deleteQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const teacherId = req.user?._id;

      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return next(new ErrorHandler("Quiz not found", 404));
      }

      const course = await CourseModel.findById(quiz.courseId);
      if (course?.teacherId?.toString() !== teacherId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to manage this quiz", 403));
      }

      await QuizModel.findByIdAndDelete(quizId);
      await QuizAttemptModel.deleteMany({ quizId });

      res.status(200).json({ success: true, message: "Quiz deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// --- ADMIN ROUTES ---

export const getAllQuizzesAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizzes = await QuizModel.find()
        .populate("courseId", "name")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, quizzes });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllQuizAttemptsAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const attempts = await QuizAttemptModel.find()
        .populate("userId", "name email")
        .populate("courseId", "name")
        .populate("quizId", "title")
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, attempts });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const archiveQuizAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const quizId = req.params.quizId;
      const quiz = await QuizModel.findById(quizId);
      if (!quiz) return next(new ErrorHandler("Quiz not found", 404));

      quiz.isArchived = !quiz.isArchived;
      await quiz.save();

      await AdminAuditLogModel.create({
        adminId: req.user?._id,
        actionType: quiz.isArchived ? "archive_quiz" : "unarchive_quiz",
        targetType: "Quiz",
        targetId: quizId,
        description: `Quiz ${quizId} archived status changed to ${quiz.isArchived}`,
      });

      res.status(200).json({ success: true, message: `Quiz ${quiz.isArchived ? 'archived' : 'unarchived'} successfully`, quiz });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
