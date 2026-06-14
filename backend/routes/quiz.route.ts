import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  createQuiz,
  getQuizzesByCourse,
  submitQuizAttempt,
  getQuizAttempts,
  getAllAttemptsForQuiz,
  editQuiz,
  deleteQuiz,
  getAllQuizzesAdmin,
  getAllQuizAttemptsAdmin,
  archiveQuizAdmin,
} from "../controllers/quiz.controller";

const quizRouter = express.Router();

quizRouter.post(
  "/create",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("teacher", "admin"),
  createQuiz
);

quizRouter.get(
  "/course/:courseId",
  updateAccessToken,
  isAuthenticated,
  getQuizzesByCourse
);

quizRouter.post(
  "/attempt/:quizId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("user", "student"),
  submitQuizAttempt
);

quizRouter.get(
  "/attempts/:quizId",
  updateAccessToken,
  isAuthenticated,
  getQuizAttempts
);

quizRouter.get(
  "/attempts/all/:quizId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("teacher", "admin"),
  getAllAttemptsForQuiz
);

quizRouter.put(
  "/edit/:quizId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("teacher", "admin"),
  editQuiz
);

quizRouter.delete(
  "/delete/:quizId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("teacher", "admin"),
  deleteQuiz
);

quizRouter.get(
  "/admin/all",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllQuizzesAdmin
);

quizRouter.get(
  "/admin/attempts",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllQuizAttemptsAdmin
);

quizRouter.put(
  "/admin/archive/:quizId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  archiveQuizAdmin
);

export default quizRouter;
