import { RequestHandler } from "express";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";
import config from "../../../config";

const createAdmin: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await AdminService.createAdmin(data);

    res.status(200).json({
      success: "true",
      statusCode: httpStatus.OK,
      message: "Admin created",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginAdmin: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await AdminService.loginAdmin(data);

    const { refreshToken, ...otherResults } = result;
    const cookieOptions = {
      secure: config.env === "production",
      httpOnly: true,
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);
    res.status(200).json({
      success: "true",
      statusCode: httpStatus.OK,
      message: "Admin login successful",
      data: otherResults,
    });
  } catch (error) {
    next(error);
  }
};

const getMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const admin = req.user;
    const result = await AdminService.getMyProfile(admin);
    res.status(200).json({
      success: "true",
      statusCode: httpStatus.OK,
      message: "Admin's information retrieved successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateMyProfile: RequestHandler = async (req, res, next) => {
  try {
    const admin = req.user;
    const data = req.body;
    const result = await AdminService.updateMyProfile(admin, data);
    res.status(200).json({
      success: "true",
      statusCode: httpStatus.OK,
      message: "Admin's information updated successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  createAdmin,
  loginAdmin,
  getMyProfile,
  updateMyProfile,
};
