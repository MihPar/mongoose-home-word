import { ParamsSecurityDeviceModel } from './../model/modelSecurityDevide/modelSecurityDevice';
import { NextFunction, Response } from "express";
import { RequestWithParams } from "../UIRepresentation/types/types";
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
