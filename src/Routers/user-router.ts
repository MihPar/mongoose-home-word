import { authorization } from "../middleware/authorizatin";
import { checkId } from "../middleware/input-value-delete-middleware";
import { inputValueLoginValidation, inputValuePasswordValidation, inputValueUserEmailValidatioin } from "../middleware/input-value-user-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { userController } from "../Compositions-root/user-composition-root";
import { Router } from "express";

export const usersRouter = Router({});

usersRouter.get("/", authorization, userController.getAllUsers.bind(userController));
usersRouter.post(
  "/",
  authorization,
  inputValueLoginValidation,
  inputValuePasswordValidation,
  inputValueUserEmailValidatioin,
  ValueMiddleware,
  userController.createNewUser.bind(userController)
);
usersRouter.delete(
  "/:id",
  checkId,
  authorization,
  userController.deleteUserById.bind(userController)
);
