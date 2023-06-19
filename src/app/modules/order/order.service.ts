import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { Cow } from "../cow/cow.model";
import { User } from "../user/user.model";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { startSession } from "mongoose";

const createOrder = async (payload: IOrder) => {
  const { cow, buyer } = payload;
  const buyerData = await User.findById(buyer);
  const cowData = await Cow.findById(cow);
  if (!cowData) throw new ApiError(httpStatus.NOT_FOUND, "Invalid Cow Id!");
  if (!buyerData) throw new ApiError(httpStatus.NOT_FOUND, "Invalid Buyer Id");
  if (buyerData.budget < cowData.price)
    throw new ApiError(
      httpStatus.PAYMENT_REQUIRED,
      "Insufficient buyer balance!"
    );
  const session = await startSession();
  try {
    session.startTransaction();
    await Cow.findByIdAndUpdate(cow, { label: "sold out" });
    buyerData.budget -= cowData.price;
    await buyerData.save();
    const sellerData = await User.findById(cowData.seller);
    if (sellerData) {
      sellerData.income += cowData.price;
      await sellerData.save();
    }
    const result = (
      await (await Order.create(payload)).populate("cow")
    ).populate("buyer");

    await session.commitTransaction();
    session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const OrderService = {
  createOrder,
};
