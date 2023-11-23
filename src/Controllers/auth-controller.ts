import { queryUsersRepositories } from './../Compositions-root/user-composition-root';
import { DeviceService } from '../Service/deviceService';
import { JWTService } from '../Service/jwtService';
import { UserService } from '../Service/userService';
import {
  BodyPasswordRecoveryCode,
  EmailResending,
} from "../model/modelUser/bodyPasswordRecovery";
import { BodyRegistrationEmailResendigModel } from "../model/modelAuth/bodyRegistrationEamilResendingMidel";
import { BodyRegistrationConfirmationModel } from "../model/modelAuth/bodyRegistrationConfirmationModel";
import { BodyRegistrationModel } from "../model/modelAuth/bodyRegistrationMode";
import { ResAuthModel } from "../model/modelAuth/resAuthMode";
import { bodyAuthModel } from "../model/modelAuth/bodyAuthModel";
import { RequestWithBody } from "../types/types";
import { Router, Response, Request } from "express";
import { HTTP_STATUS } from "../utils/utils";
import { ObjectId } from "mongodb";
import { Users } from "../types/userTypes";
import { QueryUsersRepositories } from '../Repositories/queryRepositories/users-query-repositories';

export const authRouter = Router({});

export class AuthContorller {
  constructor(
    protected userService: UserService,
    protected jwtService: JWTService,
    protected deviceService: DeviceService,
	protected queryUsersRepositories: QueryUsersRepositories
  ) {}
  async createNewPassword(
    req: RequestWithBody<BodyPasswordRecoveryCode>,
    res: Response
  ) {
    const { newPassword, recoveryCode } = req.body;
    const resultUpdatePassword = await this.userService.setNewPassword(
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
    const passwordRecovery = await this.userService.recoveryPassword(email);
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
    const user: Users | null = await this.userService.checkCridential(
      loginOrEmail,
      password
    );
    if (!user) {
      return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    } else {
      const token: string = await this.jwtService.createJWT(user);
      const ip = req.socket.remoteAddress || "unknown";
      const title = req.headers["user-agent"] || "unknown";
      const refreshToken = await this.jwtService.createRefreshJWT(
        user._id.toString()
      );
      await this.deviceService.createDevice(ip, title, refreshToken);
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
    const payload = await this.jwtService.decodeRefreshToken(refreshToken);
    if (!payload) {
      res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
      return;
    }
    const newToken: string = await this.jwtService.createJWT(req.user);
    const newRefreshToken: string = await this.jwtService.createRefreshJWT(
      userId,
      payload.deviceId
    );
    const updateDeviceUser = await this.deviceService.updateDevice(
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
    const isDeleteDevice = await this.deviceService.logoutDevice(refreshToken);
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
    const userId: ObjectId | null = await this.jwtService.getUserIdByToken(
      token
    );
    if (!userId) return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401);
    const currentUser: Users | null = await this.queryUsersRepositories.findUserById(
      userId
    );
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
    const user = await this.userService.createNewUser(
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
    await this.userService.findUserByConfirmationCode(req.body.code);
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
  async createRegistrationEmailResending(
    req: RequestWithBody<BodyRegistrationEmailResendigModel>,
    res: Response<void>
  ): Promise<Response<void> | null> {
    const confirmUser = await this.userService.confirmEmailResendCode(
      req.body.email
    );
    if (!confirmUser) {
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    } else {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
}