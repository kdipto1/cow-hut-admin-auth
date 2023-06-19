"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const result = yield user_service_1.UserService.createUser(user);
        res.status(200).json({
            success: "true",
            statusCode: http_status_1.default.OK,
            message: "User created",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield user_service_1.UserService.getSingleUser(id);
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "User retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        const result = yield user_service_1.UserService.updateUser(id, data);
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "User updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield user_service_1.UserService.deleteUser(id);
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "User deleted successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.UserService.getAllUsers();
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "User retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.UserController = {
    createUser,
    getSingleUser,
    updateUser,
    deleteUser,
    getAllUsers,
};
