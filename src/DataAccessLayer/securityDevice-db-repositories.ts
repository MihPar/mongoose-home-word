import { DevicesModel } from './../db/db';
import { DeviceViewModel, DeviceModel, CollectionIP } from './../UI/types/deviceAuthSession';

export const securityDeviceRepositories = {
  async getDevicesAllUsers(userId: string): Promise<DeviceViewModel[]> {
    const getAllDevices: DeviceModel[] = await DevicesModel
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
  },
  async terminateSession(deviceId: string) {
    const deleteOne = await DevicesModel.deleteOne({deviceId});
    return deleteOne.deletedCount === 1;
  },
  async createDevice(device: DeviceModel): Promise<DeviceModel> {
    const resultDevice = await DevicesModel.insertMany(
      device,
    );	
    return device;
  },
  async findDeviceByDeviceId(deviceId: string) {
    return await DevicesModel.findOne({ deviceId: deviceId });
  },
  async createCollectionIP(reqData: any) {
    await DevicesModel.insertMany(reqData);
    return reqData;
  },
  async countDocs(filter: any) {
	console.log(filter)
    const result = await DevicesModel.countDocuments(filter);
	return result
  },
  async updateDeviceUser(userId: string, deviceId: string, newLastActiveDate: string) {
	await DevicesModel.updateOne({userId, deviceId}, {$set: {lastActiveDate: newLastActiveDate}})
  },
  async logoutDevice(deviceId: string) {
	const decayResult = await DevicesModel.deleteOne({deviceId})
    return decayResult.deletedCount === 1
  }
};
