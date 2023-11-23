import { SecurityDeviceController } from "../Controllers/securityDevice-controller";
import { QuerySecurityDeviceRepositories } from "../Repositories/queryRepositories/securityDevice-query-repositories";
import { SecurityDeviceRepositories } from "../Repositories/securityDevice-db-repositories";
import { DeviceService } from "../Service/deviceService";
import { JWTService } from '../Service/jwtService';

export const querySecurityDeviceRepositories = new QuerySecurityDeviceRepositories()
export const securityDeviceRepositories = new SecurityDeviceRepositories()
const jwtService = new JWTService()
const deviceService = new DeviceService(securityDeviceRepositories, jwtService, querySecurityDeviceRepositories)
export const securityDeviceController = new SecurityDeviceController(securityDeviceRepositories, jwtService, deviceService, querySecurityDeviceRepositories)
