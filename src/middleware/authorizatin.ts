import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../utils";

const expectAuthHead = "admin:qwerty"
const encoding = Buffer.from(expectAuthHead).toString('base64')

export const authorization = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
	try {
	const auth = req.headers.authorization
	if(!auth) return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
	const [key, value] = auth.split(" ")
	if(key !== 'Basic') return  res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
	if(value !== encoding) return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
	return next()
  } catch (e) {
    return false;
  }
};
