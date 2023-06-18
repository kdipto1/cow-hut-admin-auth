import { ICOw } from "./cow.interface";
import { Cow } from "./cow.model";

const createCow = async (payload: ICOw) => {
  const result = (await Cow.create(payload)).populate("seller");
  return result;
};

export const CowService = {
  createCow,
};
