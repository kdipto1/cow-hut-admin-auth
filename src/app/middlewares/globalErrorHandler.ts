import { ErrorRequestHandler } from "express";
import config from "../config";
import ApiError from "../errors/ApiError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorHandle: ErrorRequestHandler = (err, req, res, next) => {
  if (config.env === "development") console.log("Global Error Handler:", err);
  let statusCode = 500;
  // let success = false;
  let message = "Something went wrong";
  let errorMessages: { path: string | number; message: string }[] = [];
  if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessages = err?.message
      ? [
          {
            path: "",
            message: err?.message,
          },
        ]
      : [];
  } else if (err) {
    message = err?.message;
    errorMessages = err?.message
      ? [
          {
            path: "",
            message: err?.message,
          },
        ]
      : [];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== "production" ? err?.stack : undefined,
  });
  // next();
};

export default globalErrorHandle;
