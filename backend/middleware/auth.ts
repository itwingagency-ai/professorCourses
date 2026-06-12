import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors";
import ErrorHandler from "../utils/ErroHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { isStudentRole } from "../models/user.model";

// Authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;
    if (!access_token) {
      return next(
        new ErrorHandler("Please login first to access this resource", 400)
      );
    }
    const decoded = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN as string
    ) as JwtPayload;
    if (!decoded) { 
      return next(new ErrorHandler("access token is not valid", 400));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
      return next(new ErrorHandler("please login to access this resource", 404));
    }
    const parsedUser = JSON.parse(user);
    if (parsedUser.status === "blocked" || parsedUser.status === "suspended") {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      await redis.del(decoded.id);
      return next(
        new ErrorHandler(
          `Your account has been ${parsedUser.status}. Please contact support.`,
          403
        )
      );
    }
    req.user = parsedUser;
    next();
  }
);


// validate user role
// "user" is treated as "student" for backward compatibility
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role || "";
    // Normalise legacy "user" → "student" for role checks
    const effectiveRole = userRole === "user" ? "student" : userRole;

    if (!roles.includes(effectiveRole) && !roles.includes(userRole)) {
      return next(
        new ErrorHandler(
          `Role: ${userRole} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Middleware: allows any authenticated student (role === "student" | "user")
 * Rejects admin and teacher accounts from student-only routes.
 */
export const authorizeStudent = (req: Request, res: Response, next: NextFunction) => {
  const role = req.user?.role;
  if (!isStudentRole(role)) {
    return next(
      new ErrorHandler("Only students can access this resource", 403)
    );
  }
  next();
};
