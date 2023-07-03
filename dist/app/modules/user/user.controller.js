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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../../config"));
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
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield user_service_1.UserService.loginUser(data);
        const { refreshToken } = result, otherResults = __rest(result, ["refreshToken"]);
        const cookieOptions = {
            secure: config_1.default.env === "production",
            httpOnly: true,
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
        res.status(200).json({
            success: "true",
            statusCode: http_status_1.default.OK,
            message: "User logged in successfully",
            data: otherResults,
        });
    }
    catch (error) {
        next(error);
    }
});
const refreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.cookies;
        const result = yield user_service_1.UserService.refreshToken(refreshToken);
        const cookieOptions = {
            secure: config_1.default.env === "production",
            httpOnly: true,
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
        res.status(200).json({
            success: "true",
            statusCode: http_status_1.default.OK,
            message: "New access token generated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const result = yield user_service_1.UserService.getMyProfile(user);
        res.status(200).json({
            success: "true",
            statusCode: http_status_1.default.OK,
            message: "User's information retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const data = req.body;
        const result = yield user_service_1.UserService.updateMyProfile(user, data);
        res.status(200).json({
            success: "true",
            statusCode: http_status_1.default.OK,
            message: "User's information updated successfully",
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
    loginUser,
    refreshToken,
    getMyProfile,
    updateMyProfile,
};
