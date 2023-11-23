import { Users } from '../types/userTypes';
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../utils";
import { ObjectId } from "mongodb";
import { jwtService } from '../Compositions-root/auth-composition-root';
import { queryUsersRepositories } from '../Compositions-root/user-composition-root';

export const authValidationInfoMiddleware = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.headers.authorization) {
    res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    return;
  }
  const token: string = req.headers.authorization!.split(" ")[1];
  const userId: ObjectId | null = await jwtService.getUserIdByToken(token);
  if (!userId) return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
  const currentUser: Users | null = await queryUsersRepositories.findUserById(userId);
  if (!currentUser) return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
  next();
  return;
};
