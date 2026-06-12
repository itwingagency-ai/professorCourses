import mongoose, { Document, Model, Schema } from "mongoose";

export interface IQuestion {
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface IQuiz extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  questions: IQuestion[];
  passingMarks: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
});

const quizSchema = new Schema<IQuiz>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    questions: [questionSchema],
    passingMarks: { type: Number, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const QuizModel: Model<IQuiz> = mongoose.model("Quiz", quizSchema);

export interface IQuizResponse {
  questionId: mongoose.Types.ObjectId;
  selectedOptionIndex: number;
}

export interface IQuizAttempt extends Document {
  quizId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  score: number;
  passed: boolean;
  responses: IQuizResponse[];
  attemptedAt: Date;
}

const quizResponseSchema = new Schema<IQuizResponse>({
  questionId: { type: Schema.Types.ObjectId, required: true },
  selectedOptionIndex: { type: Number, required: true },
});

const quizAttemptSchema = new Schema<IQuizAttempt>({
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  responses: [quizResponseSchema],
  attemptedAt: { type: Date, default: Date.now },
});

export const QuizAttemptModel: Model<IQuizAttempt> = mongoose.model(
  "QuizAttempt",
  quizAttemptSchema
);
