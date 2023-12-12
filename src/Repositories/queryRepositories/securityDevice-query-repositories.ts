import { DevicesModel } from "../../db/db";
import { DeviceView, Devices } from "../../types/deviceAuthSessionTypes";

export class QuerySecurityDeviceRepositories {
	async getDevicesAllUsers(userId: string): Promise<DeviceView[]> {
		const getAllDevices: Devices[] = await DevicesModel
		  .find({ userId })
		  .lean();
		return getAllDevices.map(function (item) {
		  return {
			ip: item.ip,
			title: item.title,
			lastActiveDate: item.lastActiveDate,
			deviceId: item.deviceId,
		  };
		});
	  }
	  async findDeviceByDeviceId(deviceId: string) {
		return await DevicesModel.findOne({ deviceId: deviceId }, {__v: 0}).lean();
	  }
}