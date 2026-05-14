import express from "express";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  getTeacherDashboard,
  getTeacherCourses,
  createTeacherCourse,
  editTeacherCourse,
  deleteTeacherCourse,
  getTeacherCourseStudents,
  getTeacherOrders,
  getTeacherQuestions,
  addTeacherAnswer,
} from "../controllers/teacher.controller";

const teacherRouter = express.Router();

// All routes require authentication and teacher (or admin) role
const auth = [updateAccessToken, isAuthenticated, authorizeRoles("teacher", "admin")];

// GET /api/v1/teacher/dashboard
teacherRouter.get("/dashboard", ...auth, getTeacherDashboard);

// GET  /api/v1/teacher/courses
teacherRouter.get("/courses", ...auth, getTeacherCourses);

// POST /api/v1/teacher/courses
teacherRouter.post("/courses", ...auth, createTeacherCourse);

// PUT  /api/v1/teacher/courses/:id
teacherRouter.put("/courses/:id", ...auth, editTeacherCourse);

// DELETE /api/v1/teacher/courses/:id
teacherRouter.delete("/courses/:id", ...auth, deleteTeacherCourse);

// GET /api/v1/teacher/courses/:id/students
teacherRouter.get("/courses/:id/students", ...auth, getTeacherCourseStudents);

// GET /api/v1/teacher/orders
teacherRouter.get("/orders", ...auth, getTeacherOrders);

// GET /api/v1/teacher/questions
teacherRouter.get("/questions", ...auth, getTeacherQuestions);

// POST /api/v1/teacher/questions/:questionId/answer
teacherRouter.post("/questions/:questionId/answer", ...auth, addTeacherAnswer);

export default teacherRouter;
