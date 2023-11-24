import { ObjectId } from "mongodb";
import { Devices } from "../types/deviceAuthSessionTypes";
import { SecurityDeviceRepositories } from "../Repositories/securityDevice-db-repositories";
import { JWTService } from "./jwtService";
import { QuerySecurityDeviceRepositories } from "../Repositories/queryRepositories/securityDevice-query-repositories";
import { QueryUsersRepositories } from "../Repositories/queryRepositories/users-query-repositories";

export class DeviceService {
  constructor(
    protected securityDeviceRepositories: SecurityDeviceRepositories,
    protected jwtService: JWTService,
    protected querySecurityDeviceRepositories: QuerySecurityDeviceRepositories,
  ) {}
  async terminateAllCurrentSessions(userId: string, deviceId: string) {
    const findSession =
      await this.querySecurityDeviceRepositories.getDevicesAllUsers(userId);
    if (!findSession) {
      return false;
    }
    for (let session of findSession) {
      if (session.deviceId !== deviceId) {
        await this.securityDeviceRepositories.terminateSession(
          session.deviceId
        );
      }
    }
    return true;
  }
  async createDevice(
    ip: string,
    title: string,
    refreshToken: string
  ): Promise<Devices | null> {
    const payload = await this.jwtService.decodeRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }
    const lastActiveDate = this.jwtService.getLastActiveDate(refreshToken);
    const device: Devices = {
      _id: new ObjectId(),
      ip: ip,
      title: title,
      deviceId: payload.deviceId,
      userId: payload.userId,
      lastActiveDate: lastActiveDate,
    };

    const createDevice: Devices =
      await this.securityDeviceRepositories.createDevice(device);
    return createDevice;
  }
  async updateDevice(userId: string, refreshToken: string) {
    const payload = await this.jwtService.decodeRefreshToken(refreshToken);

    if (!payload) {
      return null;
    }
    const lastActiveDate = this.jwtService.getLastActiveDate(refreshToken);
    await this.securityDeviceRepositories.updateDeviceUser(
      userId,
      payload.deviceId,
      lastActiveDate
    );
    return;
  }
  async logoutDevice(refreshToken: string) {
    const payload = await this.jwtService.decodeRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }
    const logoutDevice = await this.securityDeviceRepositories.logoutDevice(
      payload.deviceId
    );
    if (!logoutDevice) {
      return null;
    }
    return true;
  }
async deleteAllDevices() {
	return await this.securityDeviceRepositories.deleteAllDevices()
}
}
