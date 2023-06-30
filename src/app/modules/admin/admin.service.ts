import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";

const createAdmin = async (payload: IAdmin) => {
  const result = await Admin.create(payload);
  return result;
};

const loginAdmin = async (payload: Partial<IAdmin>): Promise<boolean> => {
  const { phoneNumber, password } = payload;

  let isAdminExists = null;
  if (phoneNumber) {
    isAdminExists = await Admin.isAdminExists(phoneNumber);
    if (!isAdminExists)
      throw new ApiError(httpStatus.NOT_FOUND, "Admin not found");
  }

  let passwordMatch = null;
  if (password && isAdminExists) {
    passwordMatch = await Admin.isPasswordMatched(
      password,
      isAdminExists.password
    );
    if (!passwordMatch)
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");
  }
  console.log(passwordMatch);
  return true;
  // return result;
};

export const AdminService = {
  createAdmin,
  loginAdmin,
};
