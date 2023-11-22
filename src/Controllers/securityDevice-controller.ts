import { DeviceService } from '../Service/deviceService';
import { JWTService } from "../Service/jwtService";
import { Router, Request, Response } from "express";
import { SecurityDeviceRepositories } from "../Repositories/securityDevice-db-repositories";
import { HTTP_STATUS } from "../utils";
import { DeviceView } from "../types/deviceAuthSessionTypes";

export const securityDeviceRouter = Router({});

export class SecurityDeviceController {
  constructor(
    protected securityDeviceRepositories: SecurityDeviceRepositories,
    protected jwtService: JWTService,
    protected deviceService: DeviceService
  ) {}
  async getDeviceUsers(
    req: Request,
    res: Response<DeviceView[]>
  ): Promise<Response<DeviceView[]>> {
    const userId = req.user._id.toString();
    const getDevicesAllUsers: DeviceView[] =
      await this.securityDeviceRepositories.getDevicesAllUsers(userId);
    if (!getDevicesAllUsers) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(getDevicesAllUsers);
    }
  }
  async terminateCurrentSessions(
    req: Request,
    res: Response<boolean>
  ): Promise<Response<boolean>> {
    const userId = req.user._id.toString();
    const refreshToken = req.cookies.refreshToken;
    const payload = await this.jwtService.decodeRefreshToken(refreshToken);
    if (!payload) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    }
    if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(payload.deviceId)) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    const findAllCurrentDevices =
      await this.deviceService.terminateAllCurrentSessions(
        userId,
        payload.deviceId
      );
    if (!findAllCurrentDevices) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    }
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
  async terminateSessionById(
    req: Request<{ deviceId: string }>,
    res: Response<boolean>
  ): Promise<Response<boolean>> {
    const deviceId = req.params.deviceId;
    const deleteDeviceById =
      await this.securityDeviceRepositories.terminateSession(deviceId);
    if (!deleteDeviceById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}