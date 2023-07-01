import express from "express";
import { UserController } from "./user.controller";
import auth from "../../middlewares/auth";
import { ENUM_USER_ROLE } from "../../../enums/roles";

const router = express.Router();

router.post("/auth/signup", UserController.createUser);
router.post("/auth/login", UserController.loginUser);
router.post("/auth/refresh-token", UserController.refreshToken);
router.get(
  "/users/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.getSingleUser
);
router.patch(
  "/users/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.updateUser
);
router.delete(
  "/users/:id",
  auth(ENUM_USER_ROLE.ADMIN),
  UserController.deleteUser
);
router.get("/users", auth(ENUM_USER_ROLE.ADMIN), UserController.getAllUsers);

export const UserRoutes = router;
