import { SortOrder } from "mongoose";
import { ICOw, ICowFilters } from "./cow.interface";
import { Cow } from "./cow.model";
import { cowSearchableFields } from "./cow.constant";

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
  sortOrder: SortOrder,
  filters: ICowFilters
) => {
  const sortCondition: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  /**
   * todo : search
   */
  const { searchTerm, minPrice, maxPrice, ...filtersData } = filters;
  const searchCondition = [];
  const priceFilter: any = {};
  console.log(priceFilter, minPrice);
  if (minPrice && maxPrice) {
    const priceCondition = {
      price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
    };
    searchCondition.push(priceCondition);
  } else if (minPrice) {
    const priceCondition = { price: { $gte: Number(minPrice) } };
    searchCondition.push(priceCondition);
  } else if (maxPrice) {
    const priceCondition = { price: { $lte: Number(maxPrice) } };
    searchCondition.push(priceCondition);
  }

  if (searchTerm) {
    searchCondition.push({
      $or: cowSearchableFields.map(field => ({
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
  const availableSearch =
    searchCondition.length > 0 ? { $and: searchCondition } : {};
  console.log(availableSearch);
  const result = await Cow.find(availableSearch)
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const count = await Cow.count(availableSearch);
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
