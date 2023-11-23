import { AuthContorller } from "../Controllers/auth-controller";
import { QuerySecurityDeviceRepositories } from "../Repositories/queryRepositories/securityDevice-query-repositories";
import { QueryUsersRepositories } from "../Repositories/queryRepositories/users-query-repositories";
import { SecurityDeviceRepositories } from "../Repositories/securityDevice-db-repositories";
import { UserRepositories } from '../Repositories/user-db-repositories';
import { DeviceService } from "../Service/deviceService";
import { JWTService } from "../Service/jwtService";
import { UserService } from "../Service/userService";
import { EmailManager } from "../manager/email-manager";

const queryUsersRepositories = new QueryUsersRepositories()
const querySecurityDeviceRepositories = new QuerySecurityDeviceRepositories()
const userRepositories = new UserRepositories()
const emailManager = new EmailManager()
const userService = new UserService(userRepositories, emailManager, queryUsersRepositories)
export const jwtService = new JWTService()
const securityDeviceRepositories = new SecurityDeviceRepositories()
const deviceService = new DeviceService(securityDeviceRepositories, jwtService, querySecurityDeviceRepositories)
export const authContorller = new AuthContorller(userService, jwtService, deviceService, queryUsersRepositories)