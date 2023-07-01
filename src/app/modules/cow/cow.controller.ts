import { NextFunction, Request, RequestHandler, Response } from "express";
import httpStatus from "http-status";
import { CowService } from "./cow.service";
import { SortOrder } from "mongoose";
import { cowFilterableFields } from "./cow.constant";
import pick from "../../../shared/pick";

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
    next(error);
  }
};

const updateCow: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const seller = req.user;
    const data = req.body;
    const result = await CowService.updateCow(id, seller, data);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Cow updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCow: RequestHandler = async (req, res, next) => {
  try {
    const id = req.params.id;
    const seller = req.user;
    const result = await CowService.deleteCow(id, seller);
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Cow deleted successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCows: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, cowFilterableFields);
    // console.log(filters);
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = (req.query.sortBy as string) || "price";
    const sortOrder: SortOrder = (req.query.sortOrder as SortOrder) || "asc";

    const result = await CowService.getAllCows(
      skip,
      limit,
      sortBy,
      sortOrder,
      filters
    );
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: "Cows retrieved successfully",
      meta: {
        page,
        limit,
        count: result.count,
      },
      data: result.result,
    });
  } catch (error) {
    next(error);
  }
};

export const CowController = {
  createCow,
  getSingleCow,
  updateCow,
  deleteCow,
  getAllCows,
};
