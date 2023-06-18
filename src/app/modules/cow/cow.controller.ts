import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { CowService } from "./cow.service";

const createCow = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = req.body;
    const result = await CowService.createCow(data);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Cow created successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getSingleCow = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const result = await CowService.getSingleCow(id);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Cow retrieved successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const CowController = {
  createCow,
  getSingleCow,
};
