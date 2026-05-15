import express from "express";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAdminAllCourses,
  getAllCourse,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { isAuthenticated, authorizeRoles } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
const courseRouter = express.Router();

// create Course route
courseRouter.post(
  "/create-course",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse
);
// edit course
courseRouter.put(
  "/edit-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse
);
// get single course without purchasing
courseRouter.get("/get-course/:id", getSingleCourse);
// get All courses without purchasing
courseRouter.get("/get-courses", getAllCourse);
// get course by valid user
courseRouter.get("/get-course-content/:id", updateAccessToken, isAuthenticated, getCourseByUser);
// add question in course
courseRouter.put("/add-question",updateAccessToken, isAuthenticated, addQuestion);
// add answer to a question
courseRouter.put("/add-answer",updateAccessToken, isAuthenticated, authorizeRoles("admin"), addAnswer);
// add review to a course
courseRouter.put("/add-review/:id", updateAccessToken, isAuthenticated, addReview);
// add reply to a review
courseRouter.put(
  "/add-reply",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);
// get all courses -- for admin
courseRouter.get(
  "/get-admin-courses",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminAllCourses
);

// post genrate videourl
courseRouter.post("/getVdoCipherOpt", generateVideoUrl);

// delete course --- for admin
courseRouter.delete(
  "/delete-course/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);
export default courseRouter;
