import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import { CertificateModel } from "../models/certificate.model";
import CourseModel from "../models/course.model";
import userModel from "../models/user.model";
import crypto from "crypto";
import NotificationModel from "../models/notification.model";
import sendMail from "../utils/sendMail";
import { checkCertificateEligibility } from "../utils/certificateEligibility";
import AdminAuditLogModel from "../models/auditLog.model";

// Generate certificate (Idempotent)
export const generateCertificate = async (userId: string, courseId: string) => {
  const existing = await CertificateModel.findOne({ userId, courseId });
  if (existing) return existing;

  const course = await CourseModel.findById(courseId);
  if (!course || !course.isCertificateEnabled) return null;

  const isEligible = await checkCertificateEligibility(userId, courseId);
  if (!isEligible) return null;

  const certificateId = crypto.randomBytes(12).toString("hex").toUpperCase();
  const certificate = await CertificateModel.create({
    userId,
    courseId,
    certificateId,
    status: "valid"
  });

  try {
    const student = await userModel.findById(userId);
    
    if (student && course) {
      await NotificationModel.create({
        userId,
        type: "certificate_issued",
        title: "Certificate Issued!",
        message: `Congratulations! You have completed "${course.name}" and your certificate is ready.`,
        link: `/verify-certificate/${certificateId}`,
      });

      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        await sendMail({
          email: student.email,
          subject: "Your Certificate is Ready!",
          template: "certificate-issued.ejs",
          data: {
            studentName: student.name,
            courseName: course.name,
          },
        });
      }
    }
  } catch (error: any) {
    console.warn("Failed to send certificate notification/email:", error.message);
  }

  return certificate;
};

// Student gets their certificates
export const getMyCertificates = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      const certificates = await CertificateModel.find({ userId })
        .populate({
          path: "courseId",
          select: "name thumbnail teacherId",
          populate: { path: "teacherId", select: "name" }
        })
        .sort({ issuedAt: -1 });

      res.status(200).json({ success: true, certificates });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// Public certificate verification
export const verifyCertificate = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { certificateId } = req.params;
      const certificate = await CertificateModel.findOne({ certificateId });

      if (!certificate) {
        return next(new ErrorHandler("Invalid certificate ID", 404));
      }

      const course = await CourseModel.findById(certificate.courseId).select("name teacherId");
      const student = await userModel.findById(certificate.userId).select("name email");
      
      let teacherName = "Instructor";
      if (course?.teacherId) {
        const teacher = await userModel.findById(course.teacherId).select("name");
        if (teacher) teacherName = teacher.name;
      }

      res.status(200).json({
        success: true,
        data: {
          studentName: student?.name,
          courseName: course?.name,
          teacherName,
          issuedAt: certificate.issuedAt,
          certificateId: certificate.certificateId,
          status: certificate.status,
        },
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// --- ADMIN ROUTES ---

export const getAllCertificatesAdmin = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certificates = await CertificateModel.find()
        .populate("userId", "name email")
        .populate("courseId", "name")
        .sort({ issuedAt: -1 });
      res.status(200).json({ success: true, certificates });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const revokeCertificate = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certificateId = req.params.certificateId;
      const certificate = await CertificateModel.findById(certificateId);
      if (!certificate) return next(new ErrorHandler("Certificate not found", 404));

      certificate.status = "revoked";
      await certificate.save();

      await AdminAuditLogModel.create({
        adminId: req.user?._id,
        actionType: "revoke_certificate",
        targetType: "Certificate",
        targetId: certificateId,
        description: `Certificate ${certificate.certificateId} revoked`,
      });

      res.status(200).json({ success: true, message: "Certificate revoked successfully", certificate });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

export const restoreCertificate = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const certificateId = req.params.certificateId;
      const certificate = await CertificateModel.findById(certificateId);
      if (!certificate) return next(new ErrorHandler("Certificate not found", 404));

      certificate.status = "valid";
      await certificate.save();

      await AdminAuditLogModel.create({
        adminId: req.user?._id,
        actionType: "restore_certificate",
        targetType: "Certificate",
        targetId: certificateId,
        description: `Certificate ${certificate.certificateId} restored`,
      });

      res.status(200).json({ success: true, message: "Certificate restored successfully", certificate });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
