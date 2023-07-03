"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const handleValidationError_1 = __importDefault(require("../../errors/handleValidationError"));
const handleCastError_1 = __importDefault(require("../../errors/handleCastError"));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandle = (err, req, res, next) => {
    // eslint-disable-next-line no-console
    if (config_1.default.env === "development")
        console.log("Global Error Handler:", err);
    let statusCode = 500;
    // let success = false;
    let message = "Something went wrong";
    let errorMessages = [];
    if (err instanceof ApiError_1.default) {
        statusCode = err === null || err === void 0 ? void 0 : err.statusCode;
        message = err === null || err === void 0 ? void 0 : err.message;
        errorMessages = (err === null || err === void 0 ? void 0 : err.message)
            ? [
                {
                    path: "",
                    message: err === null || err === void 0 ? void 0 : err.message,
                },
            ]
            : [];
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "ValidationError") {
        const customErrorStack = (0, handleValidationError_1.default)(err);
        statusCode = customErrorStack.statusCode;
        message = customErrorStack.message;
        errorMessages = customErrorStack.errorMessages;
    }
    else if ((err === null || err === void 0 ? void 0 : err.name) === "CastError") {
        const customErrorStack = (0, handleCastError_1.default)(err);
        statusCode = customErrorStack.statusCode;
        message = customErrorStack.message;
        errorMessages = customErrorStack.errorMessages;
    }
    else if (err) {
        message = err === null || err === void 0 ? void 0 : err.message;
        errorMessages = (err === null || err === void 0 ? void 0 : err.message)
            ? [
                {
                    path: "",
                    message: err === null || err === void 0 ? void 0 : err.message,
                },
            ]
            : [];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.env !== "production" ? err === null || err === void 0 ? void 0 : err.stack : undefined,
    });
    // next();
};
exports.default = globalErrorHandle;
