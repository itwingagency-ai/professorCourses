import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";
import { updateAccessToken } from "../controllers/user.controller";

const layoutRouter = express.Router();

// create layout --- for admin only
layoutRouter.post(
  "/create-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  createLayout
);
// edit layout --- only for admin
layoutRouter.put(
  "/edit-layout",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  editLayout
);
// get layout type
//layoutRouter.get("/get-layout-type", getLayoutByType);
layoutRouter.get("/get-layout/:type", getLayoutByType); //:type means params

export default layoutRouter;
