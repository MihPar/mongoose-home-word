import { ObjectId } from 'mongodb';
import { DeviceModel } from './../UI/types/deviceAuthSession';
import { jwtService } from './jwtService';
import { securityDeviceRepositories } from './../DataAccessLayer/securityDevice-db-repositories';

export const deviceService = {
	async terminateAllCurrentSessions(userId: string, deviceId: string) {
		const findSession = await securityDeviceRepositories.getDevicesAllUsers(userId)
		if(!findSession) {
			return false
		}
		for(let session of findSession) {
			if(session.deviceId !== deviceId) {
				await securityDeviceRepositories.terminateSession(session.deviceId)
			}
		}
		return true
	},
	async createDevice(ip: string, title: string, refreshToken: string): Promise<DeviceModel | null> {
		const payload = await jwtService.decodeRefreshToken(refreshToken)
		if(!payload){
			return null
		}
		const lastActiveDate = jwtService.getLastActiveDate(refreshToken)
		const device: DeviceModel = {
			_id: new ObjectId(),
			ip: ip,
    		title: title,
    		deviceId: payload.deviceId,
    		userId: payload.userId,
			lastActiveDate: lastActiveDate,
		}
		
		const createDevice: DeviceModel = await securityDeviceRepositories.createDevice(device)
		return createDevice
	},
	async updateDevice(userId: string, refreshToken: string) {
		const payload = await jwtService.decodeRefreshToken(refreshToken)

		if(!payload){
			return null
		}

		const lastActiveDate = jwtService.getLastActiveDate(refreshToken)

		await securityDeviceRepositories.updateDeviceUser(userId, payload.deviceId, lastActiveDate)
		return
	},
	async logoutDevice(refreshToken: string) {
		const payload = await jwtService.decodeRefreshToken(refreshToken)
		if(!payload){
			return null
		}
		const logoutDevice = await securityDeviceRepositories.logoutDevice(payload.deviceId)
        if(!logoutDevice) {
            return null
        }
		return true
	}
}