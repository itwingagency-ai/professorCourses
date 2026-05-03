import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { getNotifications, updateNotifications } from "../controllers/notification.controller";
import { updateAccessToken } from "../controllers/user.controller";

const notifciationRouter = express.Router();
// get all notification
notifciationRouter.get(
  "/get-all-notifications",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getNotifications
);
// update notification 
notifciationRouter.put(
    "/update-notification/:id",
    updateAccessToken,
    isAuthenticated,
    authorizeRoles("admin"),
    updateNotifications
  );
export default notifciationRouter;
