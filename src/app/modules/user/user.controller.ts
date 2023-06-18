import { NextFunction, Request, RequestHandler, Response } from "express";
import { UserService } from "./user.service";
import httpStatus from "http-status";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.body;
    console.log(user);
    const result = await UserService.createUser(user);
    res.status(200).json({
      success: "true",
      statusCode: httpStatus.OK,
      message: "User created",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getSingleUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const result = await UserService.getSingleUser(id);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "User retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await UserService.updateUser(id, data);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const UserController = {
  createUser,
  getSingleUser,
  updateUser,
};
