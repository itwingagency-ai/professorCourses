import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  createAssignment,
  getAssignmentsByCourse,
  submitAssignment,
  getStudentSubmission,
  gradeAssignment,
  editAssignment,
  deleteAssignment,
  getAllSubmissionsForAssignment,
} from "../controllers/assignment.controller";

const assignmentRouter = express.Router();

assignmentRouter.post(
  "/create",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("teacher", "admin"),
  createAssignment
);

assignmentRouter.get(
  "/course/:courseId",
  updateAccessToken,
  isAuthenticated,
  getAssignmentsByCourse
);

assignmentRouter.post(
  "/submit/:assignmentId",
  updateAccessToken,
  isAuthenticated,
  submitAssignment
);

assignmentRouter.get(
  "/submission/:assignmentId",
  updateAccessToken,
  isAuthenticated,
  getStudentSubmission
);

assignmentRouter.put(
  "/grade/:submissionId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("teacher", "admin"),
  gradeAssignment
);

assignmentRouter.put(
  "/edit/:assignmentId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("teacher", "admin"),
  editAssignment
);

assignmentRouter.delete(
  "/delete/:assignmentId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("teacher", "admin"),
  deleteAssignment
);

assignmentRouter.get(
  "/submissions/:assignmentId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("teacher", "admin"),
  getAllSubmissionsForAssignment
);

export default assignmentRouter;
