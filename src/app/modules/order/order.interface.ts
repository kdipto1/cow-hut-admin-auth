import { Model } from "mongoose";
import { Schema } from "mongoose";

export type IOrder = {
  cow: Schema.Types.ObjectId;
  buyer: Schema.Types.ObjectId;
};

export type OrderModel = Model<IOrder, Record<string, unknown>>;
