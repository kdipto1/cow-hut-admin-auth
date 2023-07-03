"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const cow_controller_1 = require("./cow.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const roles_1 = require("../../../enums/roles");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(roles_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.createCow);
router.get("/", (0, auth_1.default)(roles_1.ENUM_USER_ROLE.ADMIN, roles_1.ENUM_USER_ROLE.BUYER, roles_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.getAllCows);
router.get("/:id", (0, auth_1.default)(roles_1.ENUM_USER_ROLE.ADMIN, roles_1.ENUM_USER_ROLE.BUYER, roles_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.getSingleCow);
router.patch("/:id", (0, auth_1.default)(roles_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.updateCow);
router.delete("/:id", (0, auth_1.default)(roles_1.ENUM_USER_ROLE.SELLER), cow_controller_1.CowController.deleteCow);
exports.CowRoutes = router;
