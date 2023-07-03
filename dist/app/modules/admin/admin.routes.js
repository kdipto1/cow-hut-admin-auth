"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const roles_1 = require("../../../enums/roles");
const router = express_1.default.Router();
router.post("/create-admin", admin_controller_1.AdminController.createAdmin);
router.post("/login", admin_controller_1.AdminController.loginAdmin);
router.get("/my-profile", (0, auth_1.default)(roles_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.getMyProfile);
router.patch("/my-profile", (0, auth_1.default)(roles_1.ENUM_USER_ROLE.ADMIN), admin_controller_1.AdminController.updateMyProfile);
exports.AdminRoutes = router;
