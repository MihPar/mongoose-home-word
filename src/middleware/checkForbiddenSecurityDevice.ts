import { securityDeviceRepositories } from "../Repositories/securityDevice-db-repositories";
import { HTTP_STATUS } from "../utils";
import { NextFunction, Request, Response } from "express";

export const checkForbiddenSecurityDevice = async function (
  req: Request<{deviceId: string}>,
  res: Response,
  next: NextFunction
) {
  const deviceId = req.params.deviceId;

  if (!deviceId) {
    return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  }

  if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(deviceId)) {
    return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  }

console.log(deviceId, 'deviceId')

  const findSession = await securityDeviceRepositories.findDeviceByDeviceId(deviceId);

  console.log(findSession, 'findSession')

  if (!findSession) {
    return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  }

  const userId = req.user._id.toString();

  console.log(userId, 'userId')

  if (findSession.userId !== userId) {
    return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
  }

  return next();
};
