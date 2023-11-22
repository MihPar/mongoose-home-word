import { ParamsSecurityDeviceModel } from './../model/modelSecurityDevice/modelSecurityDevice';
import { RequestWithParams } from '../types/types';
import { NextFunction, Response } from "express";
import { HTTP_STATUS } from "../utils";

export const checkDeviceId = function (
  req: RequestWithParams<ParamsSecurityDeviceModel>,
  res: Response<void>,
  next: NextFunction
) {
  if (!/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(req.params.deviceId)) {
    return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
  }
  next();
  return;
};
