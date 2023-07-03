import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { IUser, IUserLoginResponse } from "./user.interface";
import { User } from "./user.model";
import { JwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
// import bcrypt from "bcrypt";

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

/**
 * !this route is to hash password of all users in database
 * !not recommended to use
 */
// const getAllUsers = async (): Promise<IUser[]> => {
//   try {
//     // Retrieve all documents from the collection
//     const documents = await User.find({}).lean();

//     // Hash and update the password for each document
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     // await Promise.all(
//     //   documents.map(async (document: any) => {
//     //     const hashedPassword = await bcrypt.hash(document.password, 12);
//     //     await User.findByIdAndUpdate(
//     //       document._id,
//     //       { password: hashedPassword },
//     //       { new: true }
//     //     );
//     //   })
//     // );
//     // const compare = await Promise.all(
//     //   documents.map(async (document: any) => {
//     //     const hashedPassword = await bcrypt.compare(
//     //       "s3cur3p@ssw0rd",
//     //       document.password
//     //     );
//     //     return hashedPassword;
//     //   })
//     // );

//     console.log(compare);
//     console.log("Passwords hashed and saved successfully.");
//     return documents;
//   } catch (error) {
//     console.error("Error retrieving and updating documents:", error);
//     throw error;
//   }
// };

const loginUser = async (
  payload: Partial<IUser>
): Promise<IUserLoginResponse> => {
  const { phoneNumber, password } = payload;

  if (!phoneNumber)
    throw new ApiError(httpStatus.BAD_REQUEST, "Phone number is required");
  if (!password)
    throw new ApiError(httpStatus.BAD_REQUEST, "Password is required");

  const isUserExists = await User.isUserExists(phoneNumber);

  if (!isUserExists) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

  const passwordMatch = await User.isPasswordMatched(
    password,
    isUserExists.password
  );
  if (!passwordMatch)
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid password");

  const { role, _id: userId } = isUserExists;
  const accessToken = JwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string
  );
  const refreshToken = JwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_secret_expiresIn as string
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = JwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    ) as JwtPayload;
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }
  const { userId } = verifiedToken;
  const isUserExists = await User.isUserExistsWithId(userId);
  if (!isUserExists) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  const accessToken = JwtHelpers.createToken(
    {
      userId: isUserExists._id,
      role: isUserExists.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expiresIn as string
  );
  return {
    accessToken,
  };
};

const getMyProfile = async (payload: JwtPayload | string) => {
  const userId = typeof payload === "string" ? payload : payload.userId;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid user ID");
  }

  const result = await User.findById(userId);

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return result;
};

const updateMyProfile = async (
  payload: JwtPayload | string,
  data: Partial<IUser>
) => {
  const userId = typeof payload === "string" ? payload : payload.userId;
  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid user ID");
  }

  const user = await User.findById(userId, { _id: 1 });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  /* Update user date --> */
  const { name, ...userData } = data;

  const updateUserData: Partial<IUser> = { ...userData };
  if (name && Object.keys(name).length) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IUser>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (updateUserData as any)[nameKey] = name[key as keyof typeof name];
    });
  }
  const result = await User.findByIdAndUpdate(user._id, updateUserData, {
    new: true,
  });
  return result;
};

export const UserService = {
  createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  getAllUsers,
  loginUser,
  refreshToken,
  getMyProfile,
  updateMyProfile,
};
