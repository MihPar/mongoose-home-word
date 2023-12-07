import { bodyUserModel } from "../model/modelUser/bodyUserMode";
import { ParamsUserMode } from "../model/modelUser/paramsUserModel";
import { UserService } from "../Service/userService";
import { QueryUserModel } from "../model/modelUser/queryUserModel";
import {
  PaginationType,
  RequestWithQuery,
  RequestWithBody,
  RequestWithParams,
} from "../types/types";
import { HTTP_STATUS } from "../utils/utils";
import { UserRepositories } from "../Repositories/user-db-repositories";
import { Response } from "express";
import { UserViewType } from "../types/userTypes";
import { QueryUsersRepositories } from "../Repositories/queryRepositories/users-query-repositories";


export class UserController {
  constructor(
    protected userRepositories: UserRepositories,
    protected userService: UserService,
	protected queryUsersRepositories: QueryUsersRepositories
  ) {}
  async getAllUsers(
    req: RequestWithQuery<QueryUserModel>,
    res: Response<PaginationType<UserViewType>>
  ): Promise<Response<PaginationType<UserViewType>>> {
    const {
      sortBy = "createdAt",
      sortDirection = "desc",
      pageNumber = "1",
      pageSize = "10",
      searchLoginTerm = "",
      searchEmailTerm = "",
    } = req.query;
    const users: PaginationType<UserViewType> =
      await this.queryUsersRepositories.getAllUsers(
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
        searchLoginTerm,
        searchEmailTerm
      );
    if (!users) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    } 
      return res.status(HTTP_STATUS.OK_200).send(users);
  }
  async createNewUser(
    req: RequestWithBody<bodyUserModel>,
    res: Response<UserViewType | null>
  ): Promise<Response<UserViewType> | null> {
    const { login, password, email } = req.body;
    const newUser: UserViewType | null = await this.userService.createNewUser(
      login,
      password,
      email
    );
	// console.log(newUser, ": newUser")
    return res.status(HTTP_STATUS.CREATED_201).send(newUser);
  }
  async deleteUserById(
    req: RequestWithParams<ParamsUserMode>,
    res: Response<void>
  ): Promise<Response<void>> {
    // console.log(req.params.id);
    const deleteUserById = await this.userService.deleteUserId(req.params.id);
    if (!deleteUserById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}