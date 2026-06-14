import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import { AssignmentModel, AssignmentSubmissionModel } from "../models/assignment.model";
import CourseModel from "../models/course.model";
import { isStudentEnrolled } from "../utils/enrollment";
import { isStudentRole } from "../models/user.model";
import NotificationModel from "../models/notification.model";
import userModel from "../models/user.model";
import AdminAuditLogModel from "../models/auditLog.model";

// Teacher creates an assignment
export const createAssignment = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, title, instructions, dueDate, totalMarks } = req.body;
      const teacherId = req.user?._id;

      if (!title || title.trim() === "") return next(new ErrorHandler("Assignment title is required", 400));
      if (!instructions || instructions.trim() === "") return next(new ErrorHandler("Assignment instructions are required", 400));
      if (typeof totalMarks !== "number" || totalMarks <= 0) return next(new ErrorHandler("Total marks must be greater than 0", 400));
      if (dueDate && isNaN(new Date(dueDate).getTime())) return next(new ErrorHandler("Invalid due date", 400));

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
      
      if (isStudentRole(req.user?.role)) {
        if (!req.user?._id) return next(new ErrorHandler("User ID not found", 400));
        const enrolled = await isStudentEnrolled(req.user._id as string, courseId);
        if (!enrolled) {
          return next(new ErrorHandler("You must be enrolled in this course to view its assignments", 403));
        }
      }

      const filter: any = { courseId };
      if (req.user?.role === "student" || req.user?.role === "user") {
        filter.isArchived = { $ne: true };
      }
      const assignments = await AssignmentModel.find(filter).sort({ dueDate: 1 });

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
      if (!isStudentRole(req.user?.role)) {
        return next(new ErrorHandler("Only students can submit assignments", 403));
      }

      const assignmentId = req.params.assignmentId;
      const { submissionText, submissionFileUrl } = req.body;
      const userId = req.user?._id;

      if (!userId) return next(new ErrorHandler("User ID not found", 400));

      const assignment = await AssignmentModel.findById(assignmentId);
      if (!assignment) {
        return next(new ErrorHandler("Assignment not found", 404));
      }
      if (assignment.isArchived) {
        return next(new ErrorHandler("This assignment is archived and cannot be submitted", 400));
      }

      const enrolled = await isStudentEnrolled(userId as string, assignment.courseId.toString());
      if (!enrolled) {
        return next(new ErrorHandler("You must be enrolled in this course to submit an assignment", 403));
      }

      if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) {
        return next(new ErrorHandler("Submission past due date is not allowed", 400));
      }

      if (submissionFileUrl) {
        try {
          const url = new URL(submissionFileUrl);
          if (url.protocol !== "http:" && url.protocol !== "https:") {
            return next(new ErrorHandler("submissionFileUrl must be a valid HTTP/HTTPS URL", 400));
          }
        } catch {
          return next(new ErrorHandler("Invalid submissionFileUrl format", 400));
        }
      }

      const existingSubmission = await AssignmentSubmissionModel.findOne({ assignmentId, userId });
      if (existingSubmission && existingSubmission.status === "graded") {
        return next(new ErrorHandler("Cannot edit a graded assignment submission", 400));
      }

      const isNewSubmission = !existingSubmission;

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

      // Notification
      if (isNewSubmission) {
        try {
          const student = await userModel.findById(userId);
          const course = await CourseModel.findById(assignment.courseId);
          const recipientId = assignment.createdBy || course?.teacherId;
          
          if (student && recipientId) {
            await NotificationModel.create({
              userId: recipientId,
              recipientRole: "teacher",
              type: "assignment_submitted",
              title: "New Assignment Submission",
              message: `${student.name} submitted an assignment for "${assignment.title}".`,
              link: `/teacher/courses/${assignment.courseId}`,
            });
          }
        } catch (e) {
          console.warn("Failed to notify teacher of assignment submission");
        }
      }

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

      const assignment = await AssignmentModel.findById(submission.assignmentId);
      if (!assignment) {
        return next(new ErrorHandler("Associated assignment not found", 404));
      }

      const course = await CourseModel.findById(submission.courseId);
      if (course?.teacherId?.toString() !== teacherId?.toString() && req.user?.role !== "admin") {
        return next(new ErrorHandler("Not authorized to grade this submission", 403));
      }

      if (typeof marks !== "number" || marks < 0 || marks > assignment.totalMarks) {
        return next(new ErrorHandler(`Marks must be between 0 and ${assignment.totalMarks}`, 400));
      }

      submission.marks = marks;
      submission.feedback = feedback;
      submission.status = "graded";
      submission.gradedAt = new Date();
      await submission.save();

      // Notification
      try {
        await NotificationModel.create({
          userId: submission.userId,
          recipientRole: "student",
          type: "assignment_graded",
          title: "Assignment Graded",
          message: `Your submission for "${assignment.title}" was graded: ${marks}/${assignment.totalMarks}.`,
          link: `/course-access/${assignment.courseId}`,
        });
      } catch (e) {
        console.warn("Failed to notify student of assignment grade");
      }

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

      if (title !== undefined) {
        if (title.trim() === "") return next(new ErrorHandler("Assignment title cannot be empty", 400));
        assignment.title = title;
      }
      if (instructions !== undefined) {
        if (instructions.trim() === "") return next(new ErrorHandler("Assignment instructions cannot be empty", 400));
        assignment.instructions = instructions;
      }
      if (totalMarks !== undefined) {
        if (typeof totalMarks !== "number" || totalMarks <= 0) return next(new ErrorHandler("Total marks must be greater than 0", 400));
        assignment.totalMarks = totalMarks;
      }
      if (dueDate !== undefined) {
        if (dueDate && isNaN(new Date(dueDate).getTime())) return next(new ErrorHandler("Invalid due date", 400));
        assignment.dueDate = dueDate;
      }

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

// --- ADMIN ROUTES ---

export const getAllAssignmentsAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignments = await AssignmentModel.find()
        .populate("courseId", "name")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, assignments });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const getAllSubmissionsAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const submissions = await AssignmentSubmissionModel.find()
        .populate("userId", "name email")
        .populate("courseId", "name")
        .populate("assignmentId", "title")
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, submissions });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const archiveAssignmentAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const assignmentId = req.params.assignmentId;
      const assignment = await AssignmentModel.findById(assignmentId);
      if (!assignment) return next(new ErrorHandler("Assignment not found", 404));

      assignment.isArchived = !assignment.isArchived;
      await assignment.save();

      await AdminAuditLogModel.create({
        adminId: req.user?._id,
        actionType: assignment.isArchived ? "archive_assignment" : "unarchive_assignment",
        targetType: "Assignment",
        targetId: assignmentId,
        description: `Assignment ${assignmentId} archived status changed to ${assignment.isArchived}`,
      });

      res.status(200).json({ success: true, message: `Assignment ${assignment.isArchived ? 'archived' : 'unarchived'} successfully`, assignment });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
