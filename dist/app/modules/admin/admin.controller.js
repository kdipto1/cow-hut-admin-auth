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
exports.AdminController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const admin_service_1 = require("./admin.service");
const config_1 = __importDefault(require("../../../config"));
const createAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield admin_service_1.AdminService.createAdmin(data);
        res.status(200).json({
            success: "true",
            statusCode: http_status_1.default.OK,
            message: "Admin created",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const loginAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield admin_service_1.AdminService.loginAdmin(data);
        const { refreshToken } = result, otherResults = __rest(result, ["refreshToken"]);
        const cookieOptions = {
            secure: config_1.default.env === "production",
            httpOnly: true,
        };
        res.cookie("refreshToken", refreshToken, cookieOptions);
        res.status(200).json({
            success: "true",
            statusCode: http_status_1.default.OK,
            message: "Admin login successful",
            data: otherResults,
        });
    }
    catch (error) {
        next(error);
    }
});
const getMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        const result = yield admin_service_1.AdminService.getMyProfile(admin);
        res.status(200).json({
            success: "true",
            statusCode: http_status_1.default.OK,
            message: "Admin's information retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = req.user;
        const data = req.body;
        const result = yield admin_service_1.AdminService.updateMyProfile(admin, data);
        res.status(200).json({
            success: "true",
            statusCode: http_status_1.default.OK,
            message: "Admin's information updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AdminController = {
    createAdmin,
    loginAdmin,
    getMyProfile,
    updateMyProfile,
};
