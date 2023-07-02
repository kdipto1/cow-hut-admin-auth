import express from "express";
import { AdminController } from "./admin.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/roles";

const router = express.Router();

router.post("/create-admin", AdminController.createAdmin);
router.post("/login", AdminController.loginAdmin);
router.get(
  "/my-profile",
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.getMyProfile
);
router.patch(
  "/my-profile",
  auth(ENUM_USER_ROLE.ADMIN),
  AdminController.updateMyProfile
);

export const AdminRoutes = router;
