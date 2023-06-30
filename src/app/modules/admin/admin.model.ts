import mongoose from "mongoose";
import { AdminModel, IAdmin } from "./admin.interface";
import bcrypt from "bcrypt";
import config from "../../../config";

const adminSchema = new mongoose.Schema<IAdmin, AdminModel>(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
      },
    },
  }
);

adminSchema.statics.isAdminExists = async function (
  phone: string
): Promise<Pick<IAdmin, "phoneNumber" | "role" | "password" | "_id"> | null> {
  return await Admin.findOne(
    { phoneNumber: phone },
    { _id: 1, password: 1, phoneNumber: 1, role: 1 }
  );
};
adminSchema.statics.isPasswordMatched = async function (
  incomingPass: string,
  databasePass: string
): Promise<boolean> {
  return await bcrypt.compare(incomingPass, databasePass);
};

adminSchema.pre("save", async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const admin = this;
  admin.password = await bcrypt.hash(
    admin.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

export const Admin = mongoose.model<IAdmin, AdminModel>("Admin", adminSchema);
