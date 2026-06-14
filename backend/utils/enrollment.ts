import userModel from "../models/user.model";
import mongoose from "mongoose";

export const isStudentEnrolled = async (userId: string | mongoose.Types.ObjectId, courseId: string | mongoose.Types.ObjectId): Promise<boolean> => {
  try {
    const user = await userModel.findById(userId);
    if (!user) return false;

    // Check if the course exists in the user's courses array
    const isEnrolled = user.courses.some(
      (course: any) => course.courseId.toString() === courseId.toString()
    );

    return isEnrolled;
  } catch (error) {
    return false;
  }
};
