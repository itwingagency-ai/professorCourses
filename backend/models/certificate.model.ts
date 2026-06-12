import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICertificate extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  certificateId: string;
  issuedAt: Date;
}

const certificateSchema = new Schema<ICertificate>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    certificateId: { type: String, required: true, unique: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Ensure idempotency: only one certificate per user per course
certificateSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const CertificateModel: Model<ICertificate> = mongoose.model(
  "Certificate",
  certificateSchema
);
