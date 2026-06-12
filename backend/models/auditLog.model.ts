import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAdminAuditLog extends Document {
  adminId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  description: string;
  metadata?: any;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAdminAuditLog>(
  {
    adminId: { type: String, required: true },
    actionType: { type: String, required: true },
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

const AdminAuditLogModel: Model<IAdminAuditLog> = mongoose.model(
  "AdminAuditLog",
  auditLogSchema
);

export default AdminAuditLogModel;
