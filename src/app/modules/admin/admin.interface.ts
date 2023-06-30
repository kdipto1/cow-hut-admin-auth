import { Model } from "mongoose";

export type IAdmin = {
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
  ): Promise<Pick<IAdmin, "phoneNumber" | "role" | "password"> | null>;
  isPasswordMatched(
    incomingPass: string,
    databasePass: string
  ): Promise<boolean>;
} & Model<IAdmin>;

// export type AdminModel = Model<IAdmin, Record<string, unknown>>;
