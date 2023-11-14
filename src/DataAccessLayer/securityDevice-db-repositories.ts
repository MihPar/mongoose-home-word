import { CollectionIP } from './../UIRepresentation/types/deviceAuthSession';
import {
  DeviceModel,
  DeviceViewModel,
} from "./../UIRepresentation/types/deviceAuthSession";
import {
  deviceAuthSessionCollection,
  IPAuthSessionCollection,
} from "./../db/db";
import { Filter } from 'mongodb';

export const securityDeviceRepositories = {
  async getDevicesAllUsers(userId: string): Promise<DeviceViewModel[]> {
    const getAllDevices: DeviceModel[] = await deviceAuthSessionCollection
      .find({ userId })
      .toArray();
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
    const deleteOne = await deviceAuthSessionCollection.deleteOne({deviceId});
    return deleteOne.deletedCount === 1;
  },
  async createDevice(device: DeviceModel): Promise<DeviceModel> {
    const resultDevice = await deviceAuthSessionCollection.insertOne(
      device,
    );	
    return device;
  },
  async findDeviceByDeviceId(deviceId: string) {
    return await deviceAuthSessionCollection.findOne({ deviceId: deviceId });
  },
  async createCollectionIP(reqData: any) {
    await IPAuthSessionCollection.insertOne(reqData);
    return reqData;
  },
  async countDocs(filter: Filter<CollectionIP>) {
	console.log(filter)
    const result = await IPAuthSessionCollection.countDocuments(filter);
	return result
  },
  async updateDeviceUser(userId: string, deviceId: string, newLastActiveDate: string) {
	await deviceAuthSessionCollection.updateOne({userId, deviceId}, {$set: {lastActiveDate: newLastActiveDate}})
  },
  async logoutDevice(deviceId: string) {
	const decayResult = await deviceAuthSessionCollection.deleteOne({deviceId})
    return decayResult.deletedCount === 1
  }
};
