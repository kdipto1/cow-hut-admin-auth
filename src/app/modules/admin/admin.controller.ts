import { RequestHandler } from "express";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";

const createAdmin: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await AdminService.createAdmin(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...otherResult } = result.toObject();
    res.status(200).json({
      success: "true",
      statusCode: httpStatus.OK,
      message: "Admin created",
      data: otherResult,
    });
  } catch (error) {
    next(error);
  }
};

const loginAdmin: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await AdminService.loginAdmin(data);
    res.status(200).json({
      success: "true",
      statusCode: httpStatus.OK,
      message: "Admin login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  createAdmin,
  loginAdmin,
};
