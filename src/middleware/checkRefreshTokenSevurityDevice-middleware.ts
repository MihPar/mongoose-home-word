import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../utils/utils";
import { config } from "dotenv";
import { ObjectId } from "mongodb";
import { querySecurityDeviceRepositories } from "../Compositions-root/securityDevice-compostition-root";
import { jwtService } from "../Compositions-root/auth-composition-root";
import { queryUsersRepositories } from "../Compositions-root/user-composition-root";
config();

export const checkRefreshTokenSecurityDeviceMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    return;
  }
  let result: any;
  try {
    result = await jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET!);
  } catch (err) {
    return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
  }
  const session = await querySecurityDeviceRepositories.findDeviceByDeviceId(
    result.deviceId
  );
  if (
    !session ||
    session.lastActiveDate !==
      (await jwtService.getLastActiveDate(refreshToken))
  ) {
    return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
  }
  if (result.userId) {
    const user = await queryUsersRepositories.findUserById(new ObjectId(result.userId));
    if (!user) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    }
    req.user = user;
    return next();
  }
  return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
};
