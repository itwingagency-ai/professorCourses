require("dotenv").config();

import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

const parsePositiveInt = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

// Existing env names are kept for compatibility.
// ACCESS_TOKEN_EXPIRE is treated as minutes.
// REFRESH_TOKEN_EXPIRE is treated as days.
const accessTokenExpireMinutes = parsePositiveInt(
  process.env.ACCESS_TOKEN_EXPIRE,
  5
);

const refreshTokenExpireDays = parsePositiveInt(
  process.env.REFRESH_TOKEN_EXPIRE,
  3
);

export const accessTokenExpireMs = accessTokenExpireMinutes * 60 * 1000;
export const refreshTokenExpireMs =
  refreshTokenExpireDays * 24 * 60 * 60 * 1000;

export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpireMs),
  maxAge: accessTokenExpireMs,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpireMs),
  maxAge: refreshTokenExpireMs,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  const userId = String(user._id);

  // Redis session expiry should match refresh token lifetime.
  redis.set(
    userId,
    JSON.stringify(user),
    "EX",
    Math.floor(refreshTokenExpireMs / 1000)
  );

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  const safeUser = user.toObject ? user.toObject() : { ...user };

  if ("password" in safeUser) {
    delete safeUser.password;
  }

  res.status(statusCode).json({
    success: true,
    user: safeUser,
    accessToken,
  });
};
