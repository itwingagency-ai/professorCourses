import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import { QuizModel, QuizAttemptModel } from "../models/quiz.model";
import CourseModel from "../models/course.model";

// Teacher creates a quiz
export const createQuiz = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, title, description, questions, passingMarks } = req.body;
      const teacherId = req.user?._id;

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
      const quizzes = await QuizModel.find({ courseId }).lean();

      // If student, remove correctOptionIndex
      if (req.user?.role !== "admin") {
        const course = await CourseModel.findById(courseId);
        const isTeacher = course?.teacherId?.toString() === req.user?._id?.toString();
        
        if (!isTeacher) {
          quizzes.forEach((quiz: any) => {
            quiz.questions.forEach((q: any) => {
              delete q.correctOptionIndex;
            });
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
      const quizId = req.params.quizId;
      const { responses } = req.body; // [{questionId, selectedOptionIndex}]
      const userId = req.user?._id;

      const quiz = await QuizModel.findById(quizId);
      if (!quiz) {
        return next(new ErrorHandler("Quiz not found", 404));
      }

      let score = 0;
      const gradedResponses = responses.map((r: any) => {
        const question = quiz.questions.find((q: any) => q._id.toString() === r.questionId.toString());
        if (question && question.correctOptionIndex === r.selectedOptionIndex) {
          score += 1; // Or specific question points if implemented
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

      res.status(201).json({ success: true, attempt });
    } catch (error: any) {
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

      quiz.title = title || quiz.title;
      quiz.description = description || quiz.description;
      if (questions) quiz.questions = questions;
      if (passingMarks) quiz.passingMarks = passingMarks;

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
      // Optionally delete attempts
      await QuizAttemptModel.deleteMany({ quizId });

      res.status(200).json({ success: true, message: "Quiz deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
