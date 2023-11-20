import { bodyUserModel } from "../model/modelUser/bodyUserMode";
import { ParamsUserMode } from "../model/modelUser/paramsUserModel";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import {
  inputValueLoginValidation,
  inputValuePasswordValidation,
  inputValueUserEmailValidatioin,
} from "../middleware/input-value-user-middleware";
import { userService } from "../Bisnes-logic-layer/userService";
import { authorization } from "../middleware/authorizatin";
import { QueryUserModel } from "../model/modelUser/queryUserModel";
import {
  PaginationType,
  RequestWithQuery,
  RequestWithBody,
  RequestWithParams,
} from "./types/types";
import { HTTP_STATUS } from "../utils";
import { userRepositories } from "../DataAccessLayer/user-db-repositories";
import { Router, Response } from "express";
import { checkId } from "../middleware/input-value-delete-middleware";
import { UserViewType } from "./types/userTypes";

export const usersRouter = Router({});

class UserController {
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
      await userRepositories.getAllUsers(
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
        searchLoginTerm,
        searchEmailTerm
      );
    if (!users) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(users);
    }
  }
  async createNewUser(
    req: RequestWithBody<bodyUserModel>,
    res: Response<UserViewType | null>
  ): Promise<Response<UserViewType> | null> {
    const { login, password, email } = req.body;
    const newUser: UserViewType | null = await userService.createNewUser(
      login,
      password,
      email
    );
    return res.status(HTTP_STATUS.CREATED_201).send(newUser);
  }
  async deleteUserById(
    req: RequestWithParams<ParamsUserMode>,
    res: Response<void>
  ): Promise<Response<void>> {
    console.log(req.params.id);
    const deleteUserById = await userService.deleteUserId(req.params.id);
    if (!deleteUserById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
}

export const userController = new UserController();

usersRouter.get("/", authorization, userController.getAllUsers);
usersRouter.post(
  "/",
  authorization,
  inputValueLoginValidation,
  inputValuePasswordValidation,
  inputValueUserEmailValidatioin,
  ValueMiddleware,
  userController.createNewUser
);
usersRouter.delete(
  "/:id",
  checkId,
  authorization,
  userController.deleteUserById
);
