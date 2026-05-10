import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompletedLesson {
  lessonId: string;
  completedAt: Date;
}

export interface IStudentProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedLessons: ICompletedLesson[];
  lastLessonId: string;
  progressPercentage: number;
}

const studentProgressSchema = new Schema<IStudentProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    completedLessons: [
      {
        lessonId: {
          type: String,
          required: true,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastLessonId: {
      type: String,
      default: "",
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// One progress document per user per course
studentProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const StudentProgressModel: Model<IStudentProgress> = mongoose.model(
  "StudentProgress",
  studentProgressSchema
);

export default StudentProgressModel;
