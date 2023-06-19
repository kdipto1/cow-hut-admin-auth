import { Model, Schema } from "mongoose";

export type ICOw = {
  name: string;
  age: number;
  price: number;
  location:
    | "Dhaka"
    | "Chattogram"
    | "Barishal"
    | "Rajshahi"
    | "Sylhet"
    | "Comilla"
    | "Rangpur"
    | "Mymensingh";
  breed: string;
  weight: number;
  label: "for sale" | "sold out";
  category: "Dairy" | "Beef" | "Dual Purpose";
  seller: Schema.Types.ObjectId;
};

export type CowModel = Model<ICOw, Record<string, unknown>>;

export type ICowFilters = {
  searchTerm?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  breed?: string;
  category?: string;
};
