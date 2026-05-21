import rateLimit from "express-rate-limit";
import { Request } from "express";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Login rate limiter.
 *
 * Key: IP + email  →  each account gets its own attempt budget per IP.
 * This prevents one IP from exhausting the shared limit across all users,
 * which was blocking admin login in development when testing multiple times.
 *
 * Production : 5 failed attempts / 15 min  (strict)
 * Development: 50 attempts / 15 min         (practical for testing)
 *
 * skipSuccessfulRequests: successful logins do NOT count against the window.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProduction ? 5 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  keyGenerator: (req: Request) => {
    // Composite key: IP + lowercase email
    // Each account from the same IP has its own independent limit bucket.
    const email = String(req.body?.email || "").toLowerCase().trim();
    return `${req.ip}:${email}`;
  },
});

/**
 * Account activation limiter.
 * Production: 5 / 15 min | Development: 30 / 15 min
 */
export const activationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: isProduction ? 5 : 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many activation attempts. Please try again later.",
  },
});

/**
 * Registration limiter.
 * Production: 10 / hour | Development: 50 / hour
 */
export const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: isProduction ? 10 : 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many registration attempts. Please try again later.",
  },
});
