import { RequestHandler } from "express";
import httpStatus from "http-status";
import { AdminService } from "./admin.service";
import config from "../../../config";
import { JwtHelpers } from "../../../helpers/jwtHelpers";
import ApiError from "../../../errors/ApiError";
import { Secret } from "jsonwebtoken";

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
    const { authorization } = req.headers;
    const user = JwtHelpers.verifyToken(
      authorization as string,
      config.jwt.secret as Secret
    );
    if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
    // const userId = user.userId
    const result = await AdminService.getMyProfile(user);
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

export const AdminController = {
  createAdmin,
  loginAdmin,
  getMyProfile,
};
