import { Model, Types } from "mongoose";

export type IUser = {
  _id?: Types.ObjectId;
  phoneNumber: string;
  role: "seller" | "buyer";
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
  budget: number;
  income: number;
};

// export type UserModel = Model<IUser, Record<string, unknown>>;

export type UserModel = {
  isUserExists(
    phoneNumber: string
  ): Promise<Pick<IUser, "phoneNumber" | "role" | "password" | "_id"> | null>;
  isUserExistsWithId(
    phoneNumber: string
  ): Promise<Pick<IUser, "phoneNumber" | "role" | "password" | "_id"> | null>;
  isPasswordMatched(
    incomingPass: string,
    databasePass: string
  ): Promise<boolean>;
} & Model<IUser>;

export type IUserLoginResponse = {
  accessToken: string;
  refreshToken: string;
};
