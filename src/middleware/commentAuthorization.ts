import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "../utils/utils";
import { jwtService } from "../Compositions-root/auth-composition-root";
import { queryUsersRepositories } from "../Compositions-root/user-composition-root";

export const commentAuthorization = async function(req: Request, res: Response, next: NextFunction) {
	if(!req.headers.authorization) {
		return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
	}
	const token = req.headers.authorization.split(' ')[1]
	const userId = await jwtService.getUserIdByToken(token)
	// if(!userId) {
	// 	return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
	// }
	// req.user = await UsersModel.findOne({ _id: new ObjectId(userId) })
	// return next()

	if(userId) {
		const resultAuth = await queryUsersRepositories.findUserById(userId)
		if(resultAuth){
			req.user = resultAuth
			next()
			return 
		}
		return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
	} else {
		return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
	}
}