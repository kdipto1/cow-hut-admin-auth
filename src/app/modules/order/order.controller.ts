import { RequestHandler } from "express";
import httpStatus from "http-status";
import { OrderService } from "./order.service";

const createOrder: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await OrderService.createOrder(data);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Order created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders: RequestHandler = async (req, res, next) => {
  try {
    const result = await OrderService.getAllOrders();
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Orders retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const OrderController = {
  createOrder,
  getAllOrders,
};
