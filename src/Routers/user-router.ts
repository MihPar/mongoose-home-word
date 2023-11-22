import { authorization } from "../middleware/authorizatin";
import { checkId } from "../middleware/input-value-delete-middleware";
import { inputValueLoginValidation, inputValuePasswordValidation, inputValueUserEmailValidatioin } from "../middleware/input-value-user-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { usersRouter } from "../Controllers/users-controller";
import { userController } from "../Compositions-root/user-composition-root";

usersRouter.get("/", authorization, userController.getAllUsers.bind(userController.getAllUsers));
usersRouter.post(
  "/",
  authorization,
  inputValueLoginValidation,
  inputValuePasswordValidation,
  inputValueUserEmailValidatioin,
  ValueMiddleware,
  userController.createNewUser.bind(userController.createNewUser)
);
usersRouter.delete(
  "/:id",
  checkId,
  authorization,
  userController.deleteUserById.bind(userController.deleteUserById)
);
