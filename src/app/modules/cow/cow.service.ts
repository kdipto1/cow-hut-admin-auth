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

export const CowService = {
  createCow,
  getSingleCow,
  updateCow,
  deleteCow,
};
