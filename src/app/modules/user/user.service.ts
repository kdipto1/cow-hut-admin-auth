import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: IUser): Promise<IUser> => {
  payload.income = 0;
  const result = await User.create(payload);
  return result;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  if (!result) throw new ApiError(httpStatus.BAD_REQUEST, "User not found!");
  return result;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const { name, ...userData } = payload;

  const updateUserData: Partial<IUser> = { ...userData };
  if (name && Object.keys(name).length) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updateUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await User.findByIdAndUpdate(id, updateUserData, {
    new: true,
  });
  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, "User not available to update");
  return result;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  if (!result)
    throw new ApiError(httpStatus.BAD_REQUEST, "User not available to delete");
  return result;
};

const getAllUsers = async (): Promise<IUser[]> => {
  const result = await User.find({});
  return result;
};

export const UserService = {
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getAllUsers,
};
