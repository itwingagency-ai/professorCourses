import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  createQuiz,
  getQuizzesByCourse,
  submitQuizAttempt,
  getQuizAttempts,
  editQuiz,
  deleteQuiz,
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
  submitQuizAttempt
);

quizRouter.get(
  "/attempts/:quizId",
  updateAccessToken,
  isAuthenticated,
  getQuizAttempts
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

export default quizRouter;
