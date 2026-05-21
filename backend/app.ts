require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();

// Trust the first proxy hop (Docker / nginx).
// Required for express-rate-limit to read the real client IP from
// X-Forwarded-For. Without this every request looks like it comes from
// the proxy IP and all accounts share one rate-limit bucket.
app.set("trust proxy", 1);

import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.routes";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notifciationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import studentRouter from "./routes/student.route";
import adminRouter from "./routes/admin.route";
import teacherRouter from "./routes/teacher.route";
// Body parser for using cloudinary
app.use(express.json({ limit: "50mb" }));

// cookie-parser for using cookie in frontend
app.use(cookieParser());

// cors => cross origin resource sharing ( just like whitelisting Api)
const allowedOrigins = [
  process.env.ORIGIN,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  // Next.js dev server falls back to :3001 when :3000 is already in use
  "http://localhost:3001",
  "http://127.0.0.1:3001",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin: any, callback: any) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notifciationRouter);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);
app.use("/api/v1/student", studentRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/teacher", teacherRouter);
//testing Comment APi
if (process.env.NODE_ENV !== "production") {
  app.get("/test", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
      Success: true,
      message: " Api is working",
    });
  });
}

// Unknwon route testing
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  (err.statusCode = 404), next(err);
});

app.use(ErrorMiddleware);
