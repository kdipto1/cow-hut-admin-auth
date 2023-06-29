import { IAdmin } from "./admin.interface";
import { Admin } from "./admin.model";

const createAdmin = async (payload: IAdmin) => {
  const result = await Admin.create(payload);
  return result;
};

const loginAdmin = async (payload: Partial<IAdmin>) => {
  const result = await Admin.findOne({ phoneNumber: payload.phoneNumber });
  return result;
};

export const AdminService = {
  createAdmin,
  loginAdmin,
};
