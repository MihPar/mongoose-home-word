import { AuthContorller } from "../Controllers/auth-controller";
import { SecurityDeviceRepositories } from "../Repositories/securityDevice-db-repositories";
import { UserRepositories } from '../Repositories/user-db-repositories';
import { DeviceService } from "../Service/deviceService";
import { JWTService } from "../Service/jwtService";
import { UserService } from "../Service/userService";
import { EmailManager } from "../manager/email-manager";

const userRepositories = new UserRepositories()
const emailManager = new EmailManager()
const userService = new UserService(userRepositories, emailManager)
const jwtService = new JWTService()
const securityDeviceRepositories = new SecurityDeviceRepositories()
const deviceService = new DeviceService(securityDeviceRepositories, jwtService)
export const authContorller = new AuthContorller(userService, jwtService, deviceService)