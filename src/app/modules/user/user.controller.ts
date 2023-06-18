import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";
import httpStatus from "http-status";

const createUser = async (req: Request, res: Response) => {
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
    res.json(error);
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

export const UserController = {
  createUser,
  getSingleUser,
};
