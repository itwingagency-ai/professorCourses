require("dotenv").config();
import CourseModel from "../models/course.model";
import { NextFunction, Response, Request } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import cloudinary from "cloudinary";
import {
  createCourse,
  getAllCoursesService,
} from "../services/course.services";
import { url } from "inspector";
import { redis } from "../utils/redis";
import { json } from "stream/consumers";
import mongoose from "mongoose";
import ejs, { name } from "ejs";
import { title } from "process";
import path from "path";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import axios from "axios";

const getPurchasedCourseId = (course: any): string | null => {
  if (!course) return null;

  if (typeof course === "string") {
    return course;
  }

  if (course.courseId) {
    if (typeof course.courseId === "string") {
      return course.courseId;
    }

    if (course.courseId._id) {
      return course.courseId._id.toString();
    }

    return course.courseId.toString();
  }

  if (course._id) {
    return course._id.toString();
  }

  if (course.id) {
    return course.id.toString();
  }

  return null;
};

const userHasCourseAccess = (userCourseList: any[] | undefined, courseId: string) => {
  if (!userCourseList || userCourseList.length === 0) {
    return false;
  }

  return userCourseList.some((course: any) => {
    const purchasedId = getPurchasedCourseId(course);
    return purchasedId === courseId.toString();
  });
};

// upload Course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        if (typeof thumbnail === "string" && thumbnail.startsWith("http")) {
            // Already a URL, probably from seed or external
            data.thumbnail = {
                public_id: "external",
                url: thumbnail
            };
        } else if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_SECRET_KEY) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
              folder: "courses",
            });
            data.thumbnail = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
        } else {
            console.log("⚠️ Cloudinary not configured. Using placeholder for thumbnail.");
            data.thumbnail = {
                public_id: "placeholder",
                url: "https://res.cloudinary.com/dmnwypzze/image/upload/v1698206512/course_placeholder.jpg"
            };
        }
      }
      createCourse(data, res, next);

      // Invalidate the Redis cache after creating the course
      await redis.del("allCourses");

      // Update the cache with fresh course data from MongoDB
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );
      await redis.set("allCourses", JSON.stringify(courses), "EX", 604800); // 7 days expiray;
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit course
// export const editCourse = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const data = req.body;
//       const thumbnail = data.thumbnail;
      
//       const courseId = req.params.id;
//       const courseData = await CourseModel.findById(courseId) as any;
//       if (thumbnail && !thumbnail.startsWith("https")) {
//         await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
//         const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
//           folder: "courses",
//         });
//         data.thumbnail = {
//           public_id: myCloud.public_id,
//           url: myCloud.secure_url,
//         };
//       }
//       if (thumbnail.startsWith("https")){
//         data.thumbnail = {
//           public_id: courseData?.thumbnail.public_id,
//           url: courseData?.thumbnail.secure_url,
//         };
//       }
//       const course = await CourseModel.findByIdAndUpdate(
//         courseId,
//         {
//           $set: data,
//         },
//         { new: true }
//       );
//       res.status(201).json({
//         sucsess: true,
//         course,
//       });

//       // invalidate the cache
//       await redis.del("allCourses");

//       // Update Redis cache with fresh course data from MongoDB
//       const courses = await CourseModel.find().select(
//         "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
//       );
//       await redis.set("allCourses", JSON.stringify(courses), "EX", 604800); // 7 days expiray
//     } catch (error: any) {
//       next(new ErrorHandler(error.message, 500));
//     }
//   }
// );
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail; // This is an object in your example.

      const courseId = req.params.id;
      const courseData = await CourseModel.findById(courseId) as any;

      if (thumbnail && typeof thumbnail === "object" && thumbnail.url && thumbnail.public_id) {
        // If thumbnail is already an object with `url` and `public_id`, use it as is.
        data.thumbnail = thumbnail;
      } else if (thumbnail && typeof thumbnail === "string" && !thumbnail.startsWith("https")) {
        // If thumbnail is a string but not a URL, upload it to Cloudinary.
        if (process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_SECRET_KEY) {
            if (courseData.thumbnail && courseData.thumbnail.public_id && courseData.thumbnail.public_id !== "placeholder") {
                await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
            }
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
              folder: "courses",
            });
            data.thumbnail = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
        } else {
            console.log("⚠️ Cloudinary not configured. Skipping upload, preserving existing or using placeholder.");
            data.thumbnail = courseData.thumbnail || {
                public_id: "placeholder",
                url: "https://res.cloudinary.com/dmnwypzze/image/upload/v1698206512/course_placeholder.jpg"
            };
        }
      } else if (thumbnail && typeof thumbnail === "string" && thumbnail.startsWith("https")) {
        // If thumbnail is a URL, preserve the existing thumbnail or use the URL.
        data.thumbnail = {
          public_id: courseData?.thumbnail?.public_id || "placeholder",
          url: thumbnail,
        };
      } else {
        // Invalid thumbnail format
        console.log("⚠️ Invalid thumbnail format. Using existing or placeholder.");
        data.thumbnail = courseData.thumbnail || {
            public_id: "placeholder",
            url: "https://res.cloudinary.com/dmnwypzze/image/upload/v1698206512/course_placeholder.jpg"
        };
      }

      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        course,
      });

      // Invalidate the cache
      await redis.del("allCourses");

      // Update Redis cache with fresh course data from MongoDB
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );
      await redis.set("allCourses", JSON.stringify(courses), "EX", 604800); // 7 days expiry
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);


// get single course -- without purchasing
// it is like you are viewing the data but not able the view the content
// we are securing it in network tab also
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // trying to get it from redis to reduce traffic from the server
      const courseId = req.params.id;
      const isCacheExist = await redis.get(courseId);
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        // set this in redis cache
        await redis.set(courseId, JSON.stringify(course), "EX", 604800); // 7 days expiray
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all course --- without purchasing
export const getAllCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //  trying to get it from redis to reduce traffic from the server
      const isCacheExist = await redis.get("allCourses");
      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
       //  console.log("hitting redis");
        res.status(200).json({
          success: true,
          course,
        });
      } else {
        const course = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
        );
        // set this in redis cache
        await redis.set("allCourses", JSON.stringify(course), "EX", 604800); // 7 days expiray
        // console.log("hitting mongodb");
        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// get course content == only for valid user
export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
        return next(new ErrorHandler("Invalid course ID", 400));
      }

      const courseExist = userHasCourseAccess(userCourseList, courseId);

      if (!courseExist) {
        return next(
          new ErrorHandler("You are not eligible to access this course", 403)
        );
      }

      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      if (!course.courseData || course.courseData.length === 0) {
        return next(new ErrorHandler("Course content not found or empty", 404));
      }

      res.status(200).json({
        success: true,
        course,
        content: course.courseData,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// add question in course
interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

// export const addQuestion = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { question, courseId, contentId }: IAddQuestionData = req.body;
//       const course = await CourseModel.findById(courseId);
//       if (!mongoose.Types.ObjectId.isValid(contentId)) {
//         return next(new ErrorHandler(" invalid content id", 400));
//       }
//       const courseContent = course?.courseData?.find((item: any) =>
//         item._id.equals(contentId)
//       );
//       if (!courseContent) {
//         return next(new ErrorHandler(" invalid content id", 400));
//       }

//       // create a new question object
//       const newQuestion: any = {
//         user: req.user,
//         question,
//         questionReplies: [],
//       };
//       // add this question to our course Content
//       courseContent.questions.push(newQuestion);
//       // create Notification
//       await NotificationModel.create({
//         user: req.user?._id,
//         title: "New Question Recieved",
//         message: ` you have a new Question from ${courseContent.title}`,
//       });

//       // save the updated Course
//       await course?.save();
//       res.status(200).json({
//         success: true,
//         course,
//       });
//     } catch (error: any) {
//       next(new ErrorHandler(error.message, 500));
//     }
//   }
// );

// add answer in course Question
export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const userCourseList = req.user?.courses;

      // Check if the user has enrolled in the course
      if (!userCourseList || userCourseList.length === 0) {
        return next(
          new ErrorHandler(
            "You do not have any courses, question not allowed",
            403
          )
        );
      }
      // Check if the course exists in the user's course list
      const courseExists = userHasCourseAccess(userCourseList, courseId);

      if (!courseExists) {
        return next(
          new ErrorHandler(
            "You are not eligible to ask a question in this course",
            404
          )
        );
      }

      // Fetch the course
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Validate contentId
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid content ID", 400));
      }

      // Find the course content
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );

      if (!courseContent) {
        return next(new ErrorHandler("Invalid content ID", 400));
      }

      // Create a new question object
      const newQuestion: any = {
        user: req.user,
        question,
        questionReplies: [],
      };

      // Add this question to the course content
      courseContent.questions.push(newQuestion);

      // Create a notification for the instructor/admin
      await NotificationModel.create({
        user: req.user?._id,
        title: "New Question Received",
        message: `You have a new question from ${req.user?.name} on ${courseContent.title}`,
      });

      // Save the updated course
      await course?.save();

      // Respond with success
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

interface IAddAnswerData {
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}
export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Only admin or teacher can answer questions
      const userRole = req.user?.role;
      const effectiveRole = userRole === "user" ? "student" : userRole;
      if (effectiveRole !== "admin" && effectiveRole !== "teacher") {
        return next(
          new ErrorHandler("Only admin or teacher can answer questions", 403)
        );
      }

      const { answer, courseId, contentId, questionId }: IAddAnswerData =
        req.body;
      const course = await CourseModel.findById(courseId);
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler(" invalid content id", 400));
      }
      const courseContent = course?.courseData?.find((item: any) =>
        item._id.equals(contentId)
      );
      if (!courseContent) {
        return next(new ErrorHandler(" invalid content id", 400));
      }
      const question = courseContent?.questions?.find((item: any) =>
        item._id.equals(questionId)
      );
      if (!question) {
        return next(new ErrorHandler(" invalid question id", 400));
      }
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      // add this answer to our course content
      question.questionReplies.push(newAnswer);
      await course?.save();

      // Send notification to question author
      if (req.user?._id === question.user._id) {
        await NotificationModel.create({
          user: req.user?._id,
          title: "New Question Reply Received",
          message: `You have a new question reply from ${courseContent.title}`,
        });
      } else {
        const data = {
          name: question.user.name,
          title: courseContent.title,
        };
        try {
          await sendMail({
            email: question.user.email,
            subject: "Question Reply",
            template: "question-reply.ejs",
            data,
          });
        } catch (error: any) {
          console.warn("Failed to send question reply email:", error.message);
        }
      }
      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// add review in course
interface IAddReviewData {
  review: string;
  rating: string;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;
      // Check if the user has any courses
      if (!userCourseList || userCourseList.length === 0) {
        return next(
          new ErrorHandler(
            "You do not have any courses, review not allowed",
            403
          )
        );
      }
      // check if course already exist in userCourseList based on _id
      // also checking only enrolled student can add review or own can add review
      const courseExists = userHasCourseAccess(userCourseList, courseId);

      if (!courseExists) {
        return next(
          new ErrorHandler("you are not eligible to access this course", 404)
        );
      }
      const course = await CourseModel.findById(courseId);

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const { review, rating } = req.body as IAddReviewData;
      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      };
      course?.reviews.push(reviewData);

      let avg = 0;
      course?.reviews.forEach((rev: any) => {
        avg += rev.rating;
      });
      if (course) {
        // 2 review 1=5 star and second=4 star so
        // 5+9=9 ->avg and 9/2 =4.5 overall
        course.ratings = avg / course.reviews.length;
      }
      await course?.save();
      // crate notification
      const notification = {
        title: " New Review Recieved",
        message: `${req.user?.name} has a given a review in ${course?.name}`,
      };

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// add reply to review == only admin
interface IAddReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}
export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { comment, courseId, reviewId } = req.body as IAddReviewData;
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }
      const review = course?.reviews?.find(
        (rev: any) => rev._id.toString() === reviewId
      );
      if (!review) {
        return next(new ErrorHandler("Review not found", 404));
      }
      const replyData: any = {
        user: req.user,
        comment,
      };
      if (!review.commentReplies) {
        review.commentReplies = [];
      }
      review.commentReplies.push(replyData);
      await course?.save();

      res.status(200).json({
        success: true,
        course,
      });
    } catch (error: any) {
      next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all courses --- only for admin
export const getAdminAllCourses = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllCoursesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// // delete Course --- only for admin
// export const deleteCourse = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;

//       const course = await CourseModel.findById(id);

//       if (!course) {
//         return next(new ErrorHandler("Course not found", 404));
//       }
//       if(await course.deleteOne({ id })){
//         res.status(200).json({ success: true, message: "Course deleted successfully" });
//       }
//       // update redis
//       const redisResult = await redis.del(id);
//       if (!redisResult) {
//         console.log(`Redis key for Course ${id} not found.`);
//       }
//       res.status(200).json({
//         success: true,
//         message: " Course deleted Successfully",
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 400));
//     }
//   }
// );

export const deleteCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      // Validate if the id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ErrorHandler("Invalid course ID", 400));
      }

      // Find the course by ID
      const course = await CourseModel.findById(id);

      // If course does not exist, return a 404
      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      // Delete the course
      await course.deleteOne();

      // Invalidate the Redis cache after creating the course
      await redis.del("allCourses");

      // Update the cache with fresh course data from MongoDB
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links"
      );
      await redis.set("allCourses", JSON.stringify(courses), "EX", 604800); // 7 days expiray;
      // // Remove course from Redis (if applicable)
      // const redisResult = await redis.del(id);
      // if (!redisResult) {
      //   console.log(`Redis key for Course ${id} not found.`);
      // }

      // Send success response once everything is done
      res.status(200).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// generate video Url
export const generateVideoUrl = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { videoId } = req.body;
      
      const response = await axios.post(
        `https://dev.vdocipher.com/api/videos/${videoId}/otp`,
        {
          ttl: 300,
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            // 'Authorization': `Bearer ${process.env.VDOCIpher_API_KEY}`
          },
        }
      );
      res.json(response.data);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
