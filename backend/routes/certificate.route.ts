import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  getMyCertificates,
  verifyCertificate,
} from "../controllers/certificate.controller";

const certificateRouter = express.Router();

certificateRouter.get(
  "/my-certificates",
  updateAccessToken,
  isAuthenticated,
  getMyCertificates
);

certificateRouter.get(
  "/verify/:certificateId",
  verifyCertificate
);

export default certificateRouter;
