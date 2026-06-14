import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAssignment extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  instructions: string;
  dueDate: Date;
  totalMarks: number;
  createdBy: mongoose.Types.ObjectId;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const assignmentSchema = new Schema<IAssignment>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    dueDate: { type: Date, required: true },
    totalMarks: { type: Number, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isArchived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const AssignmentModel: Model<IAssignment> = mongoose.model(
  "Assignment",
  assignmentSchema
);

export interface IAssignmentSubmission extends Document {
  assignmentId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  submissionText?: string;
  submissionFileUrl?: string;
  status: "pending" | "graded";
  marks?: number;
  feedback?: string;
  submittedAt: Date;
  gradedAt?: Date;
}

const assignmentSubmissionSchema = new Schema<IAssignmentSubmission>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    submissionText: { type: String },
    submissionFileUrl: { type: String },
    status: {
      type: String,
      enum: ["pending", "graded"],
      default: "pending",
    },
    marks: { type: Number },
    feedback: { type: String },
    submittedAt: { type: Date, default: Date.now },
    gradedAt: { type: Date },
  },
  { timestamps: true }
);

// Prevent duplicate submissions by same user for same assignment
assignmentSubmissionSchema.index({ assignmentId: 1, userId: 1 }, { unique: true });

export const AssignmentSubmissionModel: Model<IAssignmentSubmission> = mongoose.model(
  "AssignmentSubmission",
  assignmentSubmissionSchema
);
