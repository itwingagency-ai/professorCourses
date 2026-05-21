import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErroHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Log error internally
  console.error(`[ERROR] ${req.method} ${req.url} - ${err.message}`, err);

  // Hide detailed internal errors in production
  if (process.env.NODE_ENV === "production" && err.statusCode === 500) {
    err.message = "Internal Server Error";
  }

  // wrong mongodb id error from frontend
  if (err.name === "CastError") {
    const message = ` Resource not found. Invalid : ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate Key Error
  if (err.name === 11000) {
    const message = ` duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT Error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is Invalid, try again later`;
    err = new ErrorHandler(message, 400);
  }
  // JWT Expire
  if (err.name === "TokenExpiredError") {
    const message = ` Json web token is expired, try again later`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
