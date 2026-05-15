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
import { authorizeTeacherCourse } from "../middleware/courseOwnership";

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
teacherRouter.put("/courses/:id", ...auth, authorizeTeacherCourse, editTeacherCourse);

// DELETE /api/v1/teacher/courses/:id
teacherRouter.delete("/courses/:id", ...auth, authorizeTeacherCourse, deleteTeacherCourse);

// GET /api/v1/teacher/courses/:id/students
teacherRouter.get("/courses/:id/students", ...auth, authorizeTeacherCourse, getTeacherCourseStudents);

// GET /api/v1/teacher/orders
teacherRouter.get("/orders", ...auth, getTeacherOrders);

// GET /api/v1/teacher/questions
teacherRouter.get("/questions", ...auth, getTeacherQuestions);

// POST /api/v1/teacher/questions/:questionId/answer
teacherRouter.post("/questions/:questionId/answer", ...auth, authorizeTeacherCourse, addTeacherAnswer);

export default teacherRouter;
