import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { Cow } from "../cow/cow.model";
import { User } from "../user/user.model";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import { startSession } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

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

const getAllOrders = async (user: JwtPayload): Promise<IOrder[] | unknown> => {
  const { userId, role } = user;
  let result;
  if (role === "admin") {
    result = await Order.find({});
  } else if (role === "buyer") {
    result = await Order.find({ buyer: userId });
  } else if (role === "seller") {
    const orders = await Order.find({})
      .populate({
        path: "cow",
        match: { seller: userId },
      })
      .exec();
    result = orders.filter(order => order.cow !== null);
  }
  return result;
};

const getSingleOrder = async (
  user: JwtPayload,
  orderId: string
): Promise<IOrder | unknown> => {
  const { userId, role } = user;
  let result;
  if (role === "admin") {
    result = await Order.findById({ _id: orderId })
      .populate({ path: "cow", populate: { path: "seller", model: "User" } })
      .populate("buyer");
    if (!result) throw new ApiError(httpStatus.BAD_REQUEST, "Order not found");
  } else if (role === "buyer") {
    result = await Order.findById({ _id: orderId })
      .where({ buyer: userId })
      .populate({ path: "cow", populate: { path: "seller", model: "User" } })
      .populate("buyer");
    if (!result) throw new ApiError(httpStatus.BAD_REQUEST, "Order not found");
    if (result.buyer.toString() !== userId) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized access to order"
      );
    }
  } else if (role === "seller") {
    result = await Order.findById({ _id: orderId })
      .populate({
        path: "cow",
        match: { seller: userId },
        populate: { path: "seller", model: "User" },
      })
      .populate("buyer")
      .exec();
    if (!result) throw new ApiError(httpStatus.BAD_REQUEST, "Order not found");
  }
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrders,
  getSingleOrder,
};
