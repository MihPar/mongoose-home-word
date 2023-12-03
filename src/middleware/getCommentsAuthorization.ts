import { authorization } from './authorizatin';
import { NextFunction, Request, Response } from "express";
import { jwtService } from "../Compositions-root/auth-composition-root";
import { queryUsersRepositories } from "../Compositions-root/user-composition-root";

export const getCommentAuthorization = async function(req: Request, res: Response, next: NextFunction) {
	if(!req.headers.authorization) {
		 next()
		 return
	}
	const token = req.headers.authorization.split(' ')[1]
	const userId = await jwtService.getUserIdByToken(token)
	if(userId) {
		const resultAuth = await queryUsersRepositories.findUserById(userId)
		if(resultAuth){
			req.user = resultAuth
			next()
			return 
		}
		 next()
		 return
	} else {
		 next()
		 return
	}
}