"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const roles_1 = require("../../../enums/roles");
const router = express_1.default.Router();
router.post("/auth/signup", user_controller_1.UserController.createUser);
router.post("/auth/login", user_controller_1.UserController.loginUser);
router.post(
  "/auth/refresh-token",
  user_controller_1.UserController.refreshToken
);
router.get(
  "/users/my-profile",
  (0, auth_1.default)(
    roles_1.ENUM_USER_ROLE.BUYER,
    roles_1.ENUM_USER_ROLE.SELLER
  ),
  user_controller_1.UserController.getMyProfile
);
router.patch(
  "/users/my-profile",
  (0, auth_1.default)(
    roles_1.ENUM_USER_ROLE.BUYER,
    roles_1.ENUM_USER_ROLE.SELLER
  ),
  user_controller_1.UserController.updateMyProfile
);
router.get(
  "/users/:id",
  (0, auth_1.default)(roles_1.ENUM_USER_ROLE.ADMIN),
  user_controller_1.UserController.getSingleUser
);
router.patch(
  "/users/:id",
  (0, auth_1.default)(roles_1.ENUM_USER_ROLE.ADMIN),
  user_controller_1.UserController.updateUser
);
router.delete(
  "/users/:id",
  (0, auth_1.default)(roles_1.ENUM_USER_ROLE.ADMIN),
  user_controller_1.UserController.deleteUser
);
router.get(
  "/users",
  (0, auth_1.default)(roles_1.ENUM_USER_ROLE.ADMIN),
  user_controller_1.UserController.getAllUsers
);
exports.UserRoutes = router;
