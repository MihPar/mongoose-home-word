import { SecurityDeviceController } from "../Controllers/securityDevice-controller";
import { SecurityDeviceRepositories } from "../Repositories/securityDevice-db-repositories";
import { DeviceService } from "../Service/deviceService";
import { JWTService } from '../Service/jwtService';

export const securityDeviceRepositories = new SecurityDeviceRepositories()
const jwtService = new JWTService()
const deviceService = new DeviceService(securityDeviceRepositories, jwtService)
export const securityDeviceController = new SecurityDeviceController(securityDeviceRepositories, jwtService, deviceService)
