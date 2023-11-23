import { EmailManager } from './../manager/email-manager';
import { UserRepositories } from "../Repositories/user-db-repositories";
import { UserService } from "../Service/userService";
import { UserController } from '../Controllers/users-controller';
import { QueryUsersRepositories } from '../Repositories/queryRepositories/users-query-repositories';

export const queryUsersRepositories = new QueryUsersRepositories()
const userRepositories = new UserRepositories()
const emailManager = new EmailManager()
export const userService = new UserService(userRepositories, emailManager, queryUsersRepositories)
export const userController = new UserController(userRepositories, userService, queryUsersRepositories)