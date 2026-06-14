import { isStudentEnrolled } from "./enrollment";
import StudentProgressModel from "../models/studentProgress.model";
import mongoose from "mongoose";

/**
 * Validates whether a student is eligible for a certificate for a given course.
 * Currently checks if progress is 100%. Future-ready for quiz and assignment rules.
 */
export const checkCertificateEligibility = async (
  userId: string | mongoose.Types.ObjectId,
  courseId: string | mongoose.Types.ObjectId
): Promise<boolean> => {
  try {
    // 1. Must be strictly enrolled
    const enrolled = await isStudentEnrolled(userId, courseId);
    if (!enrolled) return false;

    // 2. Fetch current progress
    const progress = await StudentProgressModel.findOne({ userId, courseId });
    if (!progress) return false;

    // Future-ready flags:
    const criteria = {
      requireLessonCompletion: true,
      requireQuizPass: false,
      requireAssignmentCompletion: false,
    };

    if (criteria.requireLessonCompletion && progress.progressPercentage < 100) {
      return false;
    }

    // if (criteria.requireQuizPass) { ... logic ... }
    // if (criteria.requireAssignmentCompletion) { ... logic ... }

    return true;
  } catch (error) {
    console.error("Error in checkCertificateEligibility:", error);
    return false;
  }
};
