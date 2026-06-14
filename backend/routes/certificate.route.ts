import express from "express";
import { isAuthenticated } from "../middleware/auth";
import { updateAccessToken } from "../controllers/user.controller";
import {
  getMyCertificates,
  verifyCertificate,
  getAllCertificatesAdmin,
  revokeCertificate,
  restoreCertificate,
} from "../controllers/certificate.controller";
import { authorizeRoles } from "../middleware/auth";

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

certificateRouter.get(
  "/admin/all",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  getAllCertificatesAdmin
);

certificateRouter.put(
  "/admin/revoke/:certificateId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  revokeCertificate
);

certificateRouter.put(
  "/admin/restore/:certificateId",
  updateAccessToken,
  isAuthenticated,
  authorizeRoles("admin"),
  restoreCertificate
);

export default certificateRouter;
