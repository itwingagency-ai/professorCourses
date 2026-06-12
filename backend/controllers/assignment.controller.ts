import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import { AssignmentModel, AssignmentSubmissionModel } from "../models/assignment.model";
import CourseModel from "../models/course.model";

// Teacher creates an assignment
export const createAssignment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, title, instructions, dueDate, totalMarks } = req.body;
      const teacherId = req.user?._id;

      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      if (course.teacherId?.toString() !== teacherId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to manage this course", 403));
      }

      const assignment = await AssignmentModel.create({
        courseId,
        title,
        instructions,
        dueDate,
        totalMarks,
        createdBy: teacherId,
      });

      res.status(201).json({ success: true, assignment });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get assignments for a course
export const getAssignmentsByCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.courseId;
      const assignments = await AssignmentModel.find({ courseId }).sort({ dueDate: 1 });

      res.status(200).json({ success: true, assignments });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Student submits an assignment
export const submitAssignment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignmentId = req.params.assignmentId;
      const { submissionText, submissionFileUrl } = req.body;
      const userId = req.user?._id;

      const assignment = await AssignmentModel.findById(assignmentId);
      if (!assignment) {
        return next(new ErrorHandler("Assignment not found", 404));
      }

      // Upsert submission
      const submission = await AssignmentSubmissionModel.findOneAndUpdate(
        { assignmentId, userId },
        {
          courseId: assignment.courseId,
          submissionText,
          submissionFileUrl,
          submittedAt: new Date(),
        },
        { new: true, upsert: true }
      );

      res.status(200).json({ success: true, submission });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Get student's submission for an assignment
export const getStudentSubmission = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignmentId = req.params.assignmentId;
      const userId = req.user?._id;

      const submission = await AssignmentSubmissionModel.findOne({ assignmentId, userId });

      res.status(200).json({ success: true, submission });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Teacher grades an assignment
export const gradeAssignment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submissionId = req.params.submissionId;
      const { marks, feedback } = req.body;
      const teacherId = req.user?._id;

      const submission = await AssignmentSubmissionModel.findById(submissionId);
      if (!submission) {
        return next(new ErrorHandler("Submission not found", 404));
      }

      const course = await CourseModel.findById(submission.courseId);
      if (course?.teacherId?.toString() !== teacherId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to grade this submission", 403));
      }

      submission.marks = marks;
      submission.feedback = feedback;
      submission.status = "graded";
      submission.gradedAt = new Date();
      await submission.save();

      res.status(200).json({ success: true, submission });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Teacher edits an assignment
export const editAssignment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignmentId = req.params.assignmentId;
      const { title, instructions, dueDate, totalMarks } = req.body;
      const teacherId = req.user?._id;

      const assignment = await AssignmentModel.findById(assignmentId);
      if (!assignment) {
        return next(new ErrorHandler("Assignment not found", 404));
      }

      const course = await CourseModel.findById(assignment.courseId);
      if (course?.teacherId?.toString() !== teacherId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to manage this assignment", 403));
      }

      assignment.title = title || assignment.title;
      assignment.instructions = instructions || assignment.instructions;
      if (dueDate) assignment.dueDate = dueDate;
      if (totalMarks) assignment.totalMarks = totalMarks;

      await assignment.save();

      res.status(200).json({ success: true, assignment });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Teacher deletes an assignment
export const deleteAssignment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignmentId = req.params.assignmentId;
      const teacherId = req.user?._id;

      const assignment = await AssignmentModel.findById(assignmentId);
      if (!assignment) {
        return next(new ErrorHandler("Assignment not found", 404));
      }

      const course = await CourseModel.findById(assignment.courseId);
      if (course?.teacherId?.toString() !== teacherId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to manage this assignment", 403));
      }

      await AssignmentModel.findByIdAndDelete(assignmentId);
      // Optionally delete submissions
      await AssignmentSubmissionModel.deleteMany({ assignmentId });

      res.status(200).json({ success: true, message: "Assignment deleted successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Teacher gets all submissions for an assignment
export const getAllSubmissionsForAssignment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignmentId = req.params.assignmentId;
      const teacherId = req.user?._id;

      const assignment = await AssignmentModel.findById(assignmentId);
      if (!assignment) {
        return next(new ErrorHandler("Assignment not found", 404));
      }

      const course = await CourseModel.findById(assignment.courseId);
      if (course?.teacherId?.toString() !== teacherId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to view submissions", 403));
      }

      const submissions = await AssignmentSubmissionModel.find({ assignmentId }).populate("userId", "name email");

      res.status(200).json({ success: true, submissions });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
