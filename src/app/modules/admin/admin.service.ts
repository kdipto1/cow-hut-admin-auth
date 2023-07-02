import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IAdmin, IAdminLoginResponse } from "./admin.interface";
import { Admin } from "./admin.model";
import { JwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";

const createAdmin = async (payload: IAdmin) => {
  const result = await Admin.create(payload);
  return result;
};

const loginAdmin = async (
  payload: Partial<IAdmin>
): Promise<IAdminLoginResponse> => {
  const { phoneNumber, password } = payload;

  if (!phoneNumber)
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone number is required");
  const isAdminExists = await Admin.isAdminExists(phoneNumber);
  if (!isAdminExists)
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");

  if (!password)
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");

  const passwordMatch = await Admin.isPasswordMatched(
    password,
    isAdminExists.password
  );
  if (!passwordMatch)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");

  const { role, _id: adminId } = isAdminExists;
  const accessToken = JwtHelpers.createToken(
    { role, adminId },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string
  );
  const refreshToken = JwtHelpers.createToken(
    { role, adminId },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_secret_expiresIn as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const getMyProfile = async (payload: JwtPayload | string) => {
  const adminId = typeof payload === "string" ? payload : payload.adminId;

  if (!adminId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid admin ID");
  }

  const result = await Admin.findById(adminId);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  return result;
};

export const AdminService = {
  createAdmin,
  loginAdmin,
  getMyProfile,
};
