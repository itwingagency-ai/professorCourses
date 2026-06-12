import mongoose, { Document, Model, Schema } from "mongoose";

export type EnrollmentStatus = "active" | "completed" | "cancelled";
export type EnrollmentType = "free" | "paid";

export interface IOrder extends Document {
  courseId: string;
  userId: string;
  payment_info?: object;
  /** Enrollment lifecycle status */
  status: EnrollmentStatus;
  /** free = no Stripe; paid = Stripe (future) */
  enrollmentType: EnrollmentType;
  /** When the student enrolled */
  enrolledAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    courseId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    payment_info: {
      type: Object,
      default: {},
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },

    enrollmentType: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },

    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index to quickly look up a user's enrollment in a course
orderSchema.index({ userId: 1, courseId: 1 });

const OrderModel: Model<IOrder> = mongoose.model("Order", orderSchema);

export default OrderModel;