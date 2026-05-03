import express from "express";
import {
  activateUser,
  deleteUser,
  getAllUsers,
  getUserInfo,
  loginUser,
  logoutUser,
  registrationUser,
  socialAuth,
  updateAccessToken,
  updatePassword,
  updateProfilePicture,
  updateUserInfo,
  updateUserRole,
} from "../controllers/user.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const userRouter = express.Router();
// register user
userRouter.post("/registration", registrationUser);
// activate user
userRouter.post("/activate-user", activateUser);
// login
userRouter.post("/login", loginUser);
// logged out
userRouter.get("/logout", updateAccessToken, isAuthenticated, logoutUser);
// refresh token or update
userRouter.get("/refresh", updateAccessToken);
// get user info
userRouter.get("/me",updateAccessToken, isAuthenticated, getUserInfo);
// social auth socialAuth
userRouter.post("/social-auth", socialAuth);
// update userinfo
userRouter.put("/update-user-info",updateAccessToken, isAuthenticated, updateUserInfo);
// update password
userRouter.put("/update-user-password", updateAccessToken,isAuthenticated, updatePassword);
// update avatar
userRouter.put("/update-user-avatar", updateAccessToken,isAuthenticated, updateProfilePicture);
// get all users --only for admin
userRouter.get(
  "/get-users",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllUsers
);

// update user role -- admin only
userRouter.put(
  "/update-user",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole
);
// delete user -- admin only
userRouter.delete(
  "/delete-user-request/:id",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUser
);

export default userRouter;
