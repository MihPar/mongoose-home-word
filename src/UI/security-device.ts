import { checkRefreshTokenMiddleware } from "./../middleware/checkRefreshToken-middleware";
import { sessionService } from "./../Bisnes-logic-layer/sessionService";
import { checkForbiddenSecurityDevice } from "./../middleware/checkForbiddenSecurityDevice";
import { jwtService } from "./../Bisnes-logic-layer/jwtService";
import { checkRefreshTokenSecurityDeviceMiddleware } from "./../middleware/checkRefreshTokenSevurityDevice-middleware";
import { DeviceViewModel } from "./types/deviceAuthSession";
import { deviceService } from "./../Bisnes-logic-layer/deviceService";
import { Router, Request, Response } from "express";
import { securityDeviceRepositories } from "../DataAccessLayer/securityDevice-db-repositories";
import { HTTP_STATUS } from "../utils";

export const securityDeviceRouter = Router({});

securityDeviceRouter.get(
  "/",
  checkRefreshTokenSecurityDeviceMiddleware,
  async function (
    req: Request,
    res: Response<DeviceViewModel[]>
  ): Promise<Response<DeviceViewModel[]>> {
    // const refreshToken = req.cookies.refreshToken
    const userId = req.user._id.toString();
    // const isInBlackList = await sessionService.findRefreshToken(refreshToken)
    // if(isInBlackList) {
    // 	return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
    // }

	// const isInBlackList = await sessionService.findRefreshToken(refreshToken)
	// if(isInBlackList) {
	// 	return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
	// }
	
    const getDevicesAllUsers: DeviceViewModel[] =
      await securityDeviceRepositories.getDevicesAllUsers(userId);
    if (!getDevicesAllUsers) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(getDevicesAllUsers);
    }
  }
);

securityDeviceRouter.delete(
  "/",
  checkRefreshTokenSecurityDeviceMiddleware,
  async function (
    req: Request,
    res: Response<boolean>
  ): Promise<Response<boolean>> {
    const userId = req.user._id.toString();
    const refreshToken = req.cookies.refreshToken;
    const payload = await jwtService.decodeRefreshToken(refreshToken);
    if (!payload) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    }
    if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(payload.deviceId)) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    const findAllCurrentDevices =
      await deviceService.terminateAllCurrentSessions(userId, payload.deviceId);
    if (!findAllCurrentDevices) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    }
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

securityDeviceRouter.delete(
  "/:deviceId",
  checkRefreshTokenSecurityDeviceMiddleware,
  checkForbiddenSecurityDevice,
  async function (
    req: Request<{ deviceId: string }>,
    res: Response<boolean>
  ): Promise<Response<boolean>> {
    const deviceId = req.params.deviceId;
    const deleteDeviceById = await securityDeviceRepositories.terminateSession(
      deviceId
    );
    if (!deleteDeviceById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
