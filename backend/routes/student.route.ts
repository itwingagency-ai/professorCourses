import express from "express";
import {
  getStudentDashboard,
  getStudentOrders,
  getStudentQuestions,
  getStudentProgress,
  markLessonComplete,
  saveLastLesson,
} from "../controllers/student.controller";
import { updateAccessToken } from "../controllers/user.controller";
import { isAuthenticated, authorizeStudent } from "../middleware/auth";

const studentRouter = express.Router();

// Apply auth middleware to all student routes
studentRouter.use(updateAccessToken, isAuthenticated, authorizeStudent);

studentRouter.get("/dashboard", getStudentDashboard);
studentRouter.get("/my-orders", getStudentOrders);
studentRouter.get("/my-questions", getStudentQuestions);
studentRouter.get("/progress/:courseId", getStudentProgress);
studentRouter.post("/progress/mark-complete", markLessonComplete);
studentRouter.post("/progress/last-lesson", saveLastLesson);

export default studentRouter;
