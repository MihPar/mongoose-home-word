import { DeviceView, Devices } from '../types/deviceAuthSessionTypes';
import { DevicesModel } from '../db/db';

export class SecurityDeviceRepositories {
	  async terminateSession(deviceId: string) {
		const deleteOne = await DevicesModel.deleteOne({deviceId});
		return deleteOne.deletedCount === 1;
	  }
	  async createDevice(device: Devices): Promise<Devices> {
		const resultDevice = await DevicesModel.insertMany(
		  device,
		);	
		return device;
	  }
	  async createCollectionIP(reqData: any) {
		await DevicesModel.insertMany(reqData);
		return reqData;
	  }
	  async countDocs(filter: any) {
		console.log(filter)
		const result = await DevicesModel.countDocuments(filter);
		return result
	  }
	  async updateDeviceUser(userId: string, deviceId: string, newLastActiveDate: string) {
		await DevicesModel.updateOne({userId, deviceId}, {$set: {lastActiveDate: newLastActiveDate}})
	  }
	  async logoutDevice(deviceId: string) {
		const decayResult = await DevicesModel.deleteOne({deviceId})
		return decayResult.deletedCount === 1
	  }
}

