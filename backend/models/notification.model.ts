import { timeStamp } from "console";
import mongoose, { Document, Model, Schema } from "mongoose";

// notifciation interfcae
export interface INotification extends Document {
  userId?: string;
  recipientRole?: string; // student | teacher | admin
  type?: string;
  title: string;
  message: string;
  link?: string;
  status: string; // 'read' | 'unread'
  metadata?: any;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: false },
    recipientRole: { type: String, enum: ["student", "teacher", "admin"], required: false },
    type: { type: String, required: false },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, required: false },
    status: { type: String, required: true, default: "unread" },
    metadata: { type: Schema.Types.Mixed, required: false },
  },
  { timestamps: true }
);

const NotificationModel: Model<INotification> = mongoose.model(
  "Notification",
  notificationSchema
);

export default NotificationModel;
