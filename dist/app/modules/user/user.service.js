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
exports.UserService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const user_model_1 = require("./user.model");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
// import bcrypt from "bcrypt";
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    payload.income = 0;
    const result = yield user_model_1.User.create(payload);
    return result;
});
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    if (!result)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found!");
    return result;
});
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload, userData = __rest(payload, ["name"]);
    const updateUserData = Object.assign({}, userData);
    if (name && Object.keys(name).length) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateUserData[nameKey] = name[key];
        });
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, updateUserData, {
        new: true,
    });
    if (!result)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not available to update");
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndDelete(id);
    if (!result)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not available to delete");
    return result;
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({});
    return result;
});
/**
 * !this route is to hash password of all users in database
 * !not recommended to use
 */
// const getAllUsers = async (): Promise<IUser[]> => {
//   try {
//     // Retrieve all documents from the collection
//     const documents = await User.find({}).lean();
//     // Hash and update the password for each document
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     // await Promise.all(
//     //   documents.map(async (document: any) => {
//     //     const hashedPassword = await bcrypt.hash(document.password, 12);
//     //     await User.findByIdAndUpdate(
//     //       document._id,
//     //       { password: hashedPassword },
//     //       { new: true }
//     //     );
//     //   })
//     // );
//     // const compare = await Promise.all(
//     //   documents.map(async (document: any) => {
//     //     const hashedPassword = await bcrypt.compare(
//     //       "s3cur3p@ssw0rd",
//     //       document.password
//     //     );
//     //     return hashedPassword;
//     //   })
//     // );
//     console.log(compare);
//     console.log("Passwords hashed and saved successfully.");
//     return documents;
//   } catch (error) {
//     console.error("Error retrieving and updating documents:", error);
//     throw error;
//   }
// };
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, password } = payload;
    if (!phoneNumber)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Phone number is required");
    if (!password)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Password is required");
    const isUserExists = yield user_model_1.User.isUserExists(phoneNumber);
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const passwordMatch = yield user_model_1.User.isPasswordMatched(password, isUserExists.password);
    if (!passwordMatch)
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid password");
    const { role, _id: userId } = isUserExists;
    const accessToken = jwtHelpers_1.JwtHelpers.createToken({ userId, role }, config_1.default.jwt.secret, config_1.default.jwt.expiresIn);
    const refreshToken = jwtHelpers_1.JwtHelpers.createToken({ userId, role }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_secret_expiresIn);
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.JwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token");
    }
    const { userId } = verifiedToken;
    const isUserExists = yield user_model_1.User.isUserExistsWithId(userId);
    if (!isUserExists)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    const accessToken = jwtHelpers_1.JwtHelpers.createToken({
        userId: isUserExists._id,
        role: isUserExists.role,
    }, config_1.default.jwt.secret, config_1.default.jwt.expiresIn);
    return {
        accessToken,
    };
});
const getMyProfile = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = typeof payload === "string" ? payload : payload.userId;
    if (!userId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid user ID");
    }
    const result = yield user_model_1.User.findById(userId);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    return result;
});
const updateMyProfile = (payload, data) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = typeof payload === "string" ? payload : payload.userId;
    if (!userId) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid user ID");
    }
    const user = yield user_model_1.User.findById(userId, { _id: 1 });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    /* Update user date --> */
    const { name } = data, userData = __rest(data, ["name"]);
    const updateUserData = Object.assign({}, userData);
    if (name && Object.keys(name).length) {
        Object.keys(name).forEach(key => {
            const nameKey = `name.${key}`;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            updateUserData[nameKey] = name[key];
        });
    }
    const result = yield user_model_1.User.findByIdAndUpdate(user._id, updateUserData, {
        new: true,
    });
    return result;
});
exports.UserService = {
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
