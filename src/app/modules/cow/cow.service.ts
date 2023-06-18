import { SortOrder } from "mongoose";
import { ICOw } from "./cow.interface";
import { Cow } from "./cow.model";

const createCow = async (payload: ICOw) => {
  const result = (await Cow.create(payload)).populate("seller");
  return result;
};

const getSingleCow = async (id: string) => {
  const result = await Cow.findById(id).populate("seller");
  return result;
};

const updateCow = async (id: string, payload: Partial<ICOw>) => {
  const result = await Cow.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("seller");
  return result;
};

const deleteCow = async (id: string) => {
  const result = await Cow.findByIdAndDelete(id).populate("seller");
  return result;
};

const getAllCows = async (
  skip: number,
  limit: number,
  sortBy: string,
  sortOrder: SortOrder
) => {
  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }
  const result = await Cow.find({}).sort(sortCondition).skip(skip).limit(limit);
  const count = await Cow.count();
  return {
    result,
    count,
  };
};

export const CowService = {
  createCow,
  getSingleCow,
  updateCow,
  deleteCow,
  getAllCows,
};
