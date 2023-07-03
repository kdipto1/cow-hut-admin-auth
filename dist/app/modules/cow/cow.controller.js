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
exports.CowController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const cow_service_1 = require("./cow.service");
const cow_constant_1 = require("./cow.constant");
const pick_1 = __importDefault(require("../../../shared/pick"));
const createCow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield cow_service_1.CowService.createCow(data);
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Cow created successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleCow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const result = yield cow_service_1.CowService.getSingleCow(id);
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Cow retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateCow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const seller = req.user;
        const data = req.body;
        const result = yield cow_service_1.CowService.updateCow(id, seller, data);
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Cow updated successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const deleteCow = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const seller = req.user;
        const result = yield cow_service_1.CowService.deleteCow(id, seller);
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Cow deleted successfully",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllCows = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filters = (0, pick_1.default)(req.query, cow_constant_1.cowFilterableFields);
        // console.log(filters);
        const page = Number(req.query.page || 1);
        const limit = Number(req.query.limit || 10);
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || "price";
        const sortOrder = req.query.sortOrder || "asc";
        const result = yield cow_service_1.CowService.getAllCows(skip, limit, sortBy, sortOrder, filters);
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Cows retrieved successfully",
            meta: {
                page,
                limit,
                count: result.count,
            },
            data: result.result,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.CowController = {
    createCow,
    getSingleCow,
    updateCow,
    deleteCow,
    getAllCows,
};
