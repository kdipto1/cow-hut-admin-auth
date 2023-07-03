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
exports.CowService = void 0;
const cow_model_1 = require("./cow.model");
const cow_constant_1 = require("./cow.constant");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createCow = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield cow_model_1.Cow.create(payload)).populate("seller");
    return result;
});
const getSingleCow = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id).populate("seller");
    if (!result)
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cow not found");
    return result;
});
const updateCow = (id, seller, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.Cow.findById(id);
    if (!isExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Cow Not found!");
    }
    // const cowSellerId = isExist.seller;
    // console.log(seller);
    if (seller.userId !== isExist.seller.toString())
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not seller of this cow");
    const result = yield cow_model_1.Cow.findByIdAndUpdate(id, payload, {
        new: true,
    }).populate("seller");
    return result;
});
const deleteCow = (id, seller) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield cow_model_1.Cow.findById(id);
    if (!isExist)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cow not found!");
    if (seller.userId !== isExist.seller.toString())
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "You are not seller of this cow");
    const result = yield cow_model_1.Cow.findByIdAndDelete(id).populate("seller");
    if (!result)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Cow couldn't delete");
    return result;
});
const getAllCows = (skip, limit, sortBy, sortOrder, filters) => __awaiter(void 0, void 0, void 0, function* () {
    const sortCondition = {};
    if (sortBy && sortOrder) {
        sortCondition[sortBy] = sortOrder;
    }
    /**
     * todo : search
     */
    const { searchTerm, minPrice, maxPrice } = filters, filtersData = __rest(filters, ["searchTerm", "minPrice", "maxPrice"]);
    const searchCondition = [];
    if (minPrice && maxPrice) {
        const priceCondition = {
            price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
        };
        searchCondition.push(priceCondition);
    }
    else if (minPrice) {
        const priceCondition = { price: { $gte: Number(minPrice) } };
        searchCondition.push(priceCondition);
    }
    else if (maxPrice) {
        const priceCondition = { price: { $lte: Number(maxPrice) } };
        searchCondition.push(priceCondition);
    }
    if (searchTerm) {
        searchCondition.push({
            $or: cow_constant_1.cowSearchableFields.map(field => ({
                [field]: { $regex: searchTerm, $options: "i" },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        searchCondition.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: { $regex: value, $options: "i" },
            })),
        });
    }
    const availableSearch = searchCondition.length > 0 ? { $and: searchCondition } : {};
    const result = yield cow_model_1.Cow.find(availableSearch)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit);
    const count = yield cow_model_1.Cow.count(availableSearch);
    return {
        result,
        count,
    };
});
exports.CowService = {
    createCow,
    getSingleCow,
    updateCow,
    deleteCow,
    getAllCows,
};
