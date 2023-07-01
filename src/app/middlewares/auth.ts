import { NextFunction, Request, Response } from "express";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { JwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import { JwtPayload, Secret } from "jsonwebtoken";

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token)
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      const verifiedUser = JwtHelpers.verifyToken(
        token,
        config.jwt.secret as Secret
      ) as JwtPayload;
      req.user = verifiedUser;
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role))
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      next();
    } catch (error) {
      next(error);
    }
  };

export default auth;