import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";

// get User by id
export const getUserById = async (id: string, res: Response) => {
  // const user = await userModel.findById(id);
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// get all users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(201).json({
    success: true,
    users,
  });
};

// update user role Service
// Also clears Redis so the stale role does not persist in sessions
export const updateUserRoleService = async (res: Response, id: string, role: string) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

  // Invalidate the Redis session so the user's next request gets the fresh role
  try {
    await redis.del(id);
    // If user is currently logged in, also update the cached session with new role
    if (user) {
      await redis.set(id, JSON.stringify(user), "EX", 604800);
    }
  } catch (redisErr) {
    console.warn("Redis update failed for role change:", redisErr);
  }

  res.status(201).json({
    success: true,
    user,
  });
};