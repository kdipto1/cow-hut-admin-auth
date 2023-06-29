import mongoose from "mongoose";
import { AdminModel, IAdmin } from "./admin.interface";

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
    },
  }
);

export const Admin = mongoose.model<IAdmin, AdminModel>("Admin", adminSchema);
