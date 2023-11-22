import { EmailManager } from './../manager/email-manager';
import { UserRepositories } from "../Repositories/user-db-repositories";
import { UserService } from "../Service/userService";
import { UserController } from '../Controllers/users-controller';

const userRepositories = new UserRepositories()
const emailManager = new EmailManager()
const userService = new UserService(userRepositories, emailManager)
export const userController = new UserController(userRepositories, userService)

