"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const cow_model_1 = require("../cow/cow.model");
const user_model_1 = require("../user/user.model");
const order_model_1 = require("./order.model");
const mongoose_1 = require("mongoose");
const createOrder = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const { cow, buyer } = payload;
    const buyerData = yield user_model_1.User.findById(buyer);
    const cowData = yield cow_model_1.Cow.findById(cow);
    if (!cowData)
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        "Invalid Cow Id!"
      );
    if (!buyerData)
      throw new ApiError_1.default(
        http_status_1.default.NOT_FOUND,
        "Invalid Buyer Id"
      );
    if (buyerData.budget < cowData.price)
      throw new ApiError_1.default(
        http_status_1.default.PAYMENT_REQUIRED,
        "Insufficient buyer balance!"
      );
    const session = yield (0, mongoose_1.startSession)();
    try {
      session.startTransaction();
      yield cow_model_1.Cow.findByIdAndUpdate(cow, { label: "sold out" });
      buyerData.budget -= cowData.price;
      yield buyerData.save();
      const sellerData = yield user_model_1.User.findById(cowData.seller);
      if (sellerData) {
        sellerData.income += cowData.price;
        yield sellerData.save();
      }
      const result = (yield (yield order_model_1.Order.create(
        payload
      )).populate("cow")).populate("buyer");
      yield session.commitTransaction();
      session.endSession();
      return result;
    } catch (error) {
      yield session.abortTransaction();
      yield session.endSession();
      throw error;
    }
  });
const getAllOrders = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find({});
    return result;
  });
exports.OrderService = {
  createOrder,
  getAllOrders,
};
