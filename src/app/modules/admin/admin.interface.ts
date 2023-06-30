import { Model, Types } from "mongoose";

export type IAdmin = {
  _id?: Types.ObjectId;
  phoneNumber: string;
  role: "admin";
  password: string;
  name: {
    firstName: string;
    lastName: string;
  };
  address: string;
};

export type AdminModel = {
  isAdminExists(
    phoneNumber: string
  ): Promise<Pick<IAdmin, "phoneNumber" | "role" | "password" | "_id"> | null>;
  isPasswordMatched(
    incomingPass: string,
    databasePass: string
  ): Promise<boolean>;
} & Model<IAdmin>;

export type IAdminLoginResponse = {
  accessToken: string;
  refreshToken: string;
};
// export type AdminModel = Model<IAdmin, Record<string, unknown>>;
