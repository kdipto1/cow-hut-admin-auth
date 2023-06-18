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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CowService = void 0;
const cow_model_1 = require("./cow.model");
const createCow = payload =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = (yield cow_model_1.Cow.create(payload)).populate("seller");
    return result;
  });
const getSingleCow = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findById(id).populate("seller");
    return result;
  });
const updateCow = (id, payload) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findByIdAndUpdate(id, payload, {
      new: true,
    }).populate("seller");
    return result;
  });
const deleteCow = id =>
  __awaiter(void 0, void 0, void 0, function* () {
    const result = yield cow_model_1.Cow.findByIdAndDelete(id).populate(
      "seller"
    );
    return result;
  });
exports.CowService = {
  createCow,
  getSingleCow,
  updateCow,
  deleteCow,
};
