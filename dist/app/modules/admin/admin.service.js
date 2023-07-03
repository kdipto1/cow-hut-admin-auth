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
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const admin_model_1 = require("./admin.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield admin_model_1.Admin.create(payload);
    return result;
});
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    if (!phoneNumber)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Phone number is required");
    const isAdminExists = yield admin_model_1.Admin.isAdminExists(phoneNumber);
    if (!isAdminExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Admin not found");
    if (!password)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Password is required");
    const passwordMatch = yield admin_model_1.Admin.isPasswordMatched(password, isAdminExists.password);
    if (!passwordMatch)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid password");
    const { role, _id: adminId } = isAdminExists;
    const accessToken = jwtHelpers_1.JwtHelpers.createToken({ role, adminId }, config_1.default.jwt.secret, config_1.default.jwt.expiresIn);
    const refreshToken = jwtHelpers_1.JwtHelpers.createToken({ role, adminId }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_secret_expiresIn);
    return {
        accessToken,
        refreshToken,
    };
});
const getMyProfile = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = typeof payload === "string" ? payload : payload.adminId;
    if (!adminId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid admin ID");
    }
    const result = yield admin_model_1.Admin.findById(adminId);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Admin not found");
    }
    return result;
});
const updateMyProfile = (payload, data) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = typeof payload === "string" ? payload : payload.adminId;
    if (!adminId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid admin ID");
    }
    const admin = yield admin_model_1.Admin.findById(adminId, { _id: 1 });
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Admin not found");
    }
    /* Update user date --> */
    const { name } = data, adminData = __rest(data, ["name"]);
    const updateAdminData = Object.assign({}, adminData);
    if (name && Object.keys(name).length) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateAdminData[nameKey] = name[key];
        });
    }
    const result = yield admin_model_1.Admin.findByIdAndUpdate(admin._id, updateAdminData, {
        new: true,
    });
    return result;
});
exports.AdminService = {
    createAdmin,
    loginAdmin,
    getMyProfile,
    updateMyProfile,
};
