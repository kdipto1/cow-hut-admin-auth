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

export const CowController = {
  createCow,
};
