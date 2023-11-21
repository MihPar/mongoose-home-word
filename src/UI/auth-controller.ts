import {
  inputValueEmailAuthPasswordRecovery,
  inputValueNewPasswordAuth,
  inputValueRecoveryCodeAuth,
} from "../middleware/input-value-auth-middleware";
import {
  BodyPasswordRecoveryCode,
  EmailResending,
} from "../model/modelUser/bodyPasswordRecovery";
import { checkRefreshTokenSecurityDeviceMiddleware } from "../middleware/checkRefreshTokenSevurityDevice-middleware";
import {
  limitRequestMiddleware,
  limitRequestMiddlewarePassword,
} from "../middleware/limitRequest";
import { deviceService } from "../Bisnes-logic-layer/deviceService";
import { authValidationInfoMiddleware } from "../middleware/authValidationInfoMiddleware";
import {
  inputValueEmailAuth,
  inputValueCodeAuth,
  inputValueEmailRegistrationAuth,
  inputValuePasswordAuth,
  inputValueLoginAuth,
  inputValueLoginOrEamilAuth,
} from "../middleware/input-value-auth-middleware";
import { BodyRegistrationEmailResendigModel } from "../model/modelAuth/bodyRegistrationEamilResendingMidel";
import { BodyRegistrationConfirmationModel } from "../model/modelAuth/bodyRegistrationConfirmationModel";
import { BodyRegistrationModel } from "../model/modelAuth/bodyRegistrationMode";
import { ResAuthModel } from "../model/modelAuth/resAuthMode";
import { jwtService } from "../Bisnes-logic-layer/jwtService";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { bodyAuthModel } from "../model/modelAuth/bodyAuthModel";
import { RequestWithBody } from "./types/types";
import { Router, Response, Request } from "express";
import { HTTP_STATUS } from "../utils";
import { userService } from "../Bisnes-logic-layer/userService";
import { ObjectId } from "mongodb";
import { sessionService } from "../Bisnes-logic-layer/sessionService";
import { User } from "./types/userTypes";

export const authRouter = Router({});

class AuthContorller {
  async createNewPassword(
    req: RequestWithBody<BodyPasswordRecoveryCode>,
    res: Response
  ) {
    const { newPassword, recoveryCode } = req.body;
    const resultUpdatePassword = await userService.setNewPassword(
      newPassword,
      recoveryCode
    );
    if (!resultUpdatePassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST_400).send({
        errorsMessages: [
          { message: "recovery code is incorrect", field: "recoveryCode" },
        ],
      });
    }
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
  async createPasswordRecovery(
    req: RequestWithBody<EmailResending>,
    res: Response
  ) {
    const { email } = req.body;
    const passwordRecovery = await userService.recoveryPassword(email);
    if (!passwordRecovery) {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
  async createLogin(
    req: RequestWithBody<bodyAuthModel>,
    res: Response<{ accessToken: string }>
  ): Promise<Response<{ accessToken: string }>> {
    const { loginOrEmail, password } = req.body;
    const user: User | null = await userService.checkCridential(
      loginOrEmail,
      password
    );
    if (!user) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    } else {
      const token: string = await jwtService.createJWT(user);
      const ip = req.socket.remoteAddress || "unknown";
      const title = req.headers["user-agent"] || "unknown";
      const refreshToken = await jwtService.createRefreshJWT(
        user._id.toString()
      );
      await deviceService.createDevice(ip, title, refreshToken);
      return res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
        })
        .status(HTTP_STATUS.OK_200)
        .send({ accessToken: token });
    }
  }
  async cretaeRefreshToken(
    req: Request,
    res: Response<{ accessToken: string }>
  ): Promise<void> {
    const refreshToken: string = req.cookies.refreshToken;
    const userId = req.user._id.toString();
    const payload = await jwtService.decodeRefreshToken(refreshToken);
    if (!payload) {
      res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
      return;
    }
    const newToken: string = await jwtService.createJWT(req.user);
    const newRefreshToken: string = await jwtService.createRefreshJWT(
      userId,
      payload.deviceId
    );
    const updateDeviceUser = await deviceService.updateDevice(
      userId,
      newRefreshToken
    );
    res
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(HTTP_STATUS.OK_200)
      .send({ accessToken: newToken });
  }
  async cretaeLogout(req: Request, res: Response<void>): Promise<void> {
    const refreshToken: string = req.cookies.refreshToken;
    const isDeleteDevice = await deviceService.logoutDevice(refreshToken);
    if (!isDeleteDevice) {
      res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
      return;
    }
    res.clearCookie("refreshToken").sendStatus(HTTP_STATUS.NO_CONTENT_204);
    return;
  }
  async findMe(
    req: Request,
    res: Response<ResAuthModel>
  ): Promise<Response<ResAuthModel>> {
    if (!req.headers.authorization) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    }
    const token: string = req.headers.authorization!.split(" ")[1];
    const userId: ObjectId | null = await jwtService.getUserIdByToken(token);
    if (!userId) return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    const currentUser: User | null = await userService.findUserById(userId);
    if (!currentUser) return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    return res.status(HTTP_STATUS.OK_200).send({
      userId: currentUser._id.toString(),
      email: currentUser.accountData.email,
      login: currentUser.accountData.userName,
    });
  }
  async creteRegistration(
    req: RequestWithBody<BodyRegistrationModel>,
    res: Response<void>
  ): Promise<Response<void>> {
    const user = await userService.createNewUser(
      req.body.login,
      req.body.password,
      req.body.email
    );
    if (!user) {
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    } else {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
  async createRegistrationConfirmation(
    req: RequestWithBody<BodyRegistrationConfirmationModel>,
    res: Response<void>
  ): Promise<Response<void>> {
    await userService.findUserByConfirmationCode(req.body.code);
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
  async createRegistrationEmailResending(
    req: RequestWithBody<BodyRegistrationEmailResendigModel>,
    res: Response<void>
  ): Promise<Response<void> | null> {
    const confirmUser = await userService.confirmEmailResendCode(
      req.body.email
    );
    if (!confirmUser) {
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    } else {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
}

export const authContorller = new AuthContorller();

authRouter.post(
  "/new-password",
  limitRequestMiddlewarePassword,
  inputValueNewPasswordAuth,
  inputValueRecoveryCodeAuth,
  ValueMiddleware,
  authContorller.createNewPassword
);

authRouter.post(
  "/password-recovery",
  limitRequestMiddlewarePassword,
  inputValueEmailAuthPasswordRecovery,
  ValueMiddleware,
  authContorller.createPasswordRecovery
);

authRouter.post(
  "/login",
  limitRequestMiddleware,
  inputValueLoginOrEamilAuth,
  inputValuePasswordAuth,
  ValueMiddleware,
  authContorller.createLogin
);

authRouter.post(
  "/refresh-token",
  checkRefreshTokenSecurityDeviceMiddleware,
  authContorller.cretaeRefreshToken
);

authRouter.post(
  "/logout",
  checkRefreshTokenSecurityDeviceMiddleware,
  authContorller.cretaeRefreshToken
);

authRouter.get("/me", authValidationInfoMiddleware, authContorller.findMe);

authRouter.post(
  "/registration",
  limitRequestMiddleware,
  inputValueLoginAuth,
  inputValuePasswordAuth,
  inputValueEmailRegistrationAuth,
  ValueMiddleware,
  authContorller.creteRegistration
);

authRouter.post(
  "/registration-confirmation",
  limitRequestMiddleware,
  inputValueCodeAuth,
  ValueMiddleware,
  authContorller.createRegistrationConfirmation
);

authRouter.post(
  "/registration-email-resending",
  limitRequestMiddleware,
  inputValueEmailAuth,
  ValueMiddleware,
  authContorller.createRegistrationEmailResending
);
