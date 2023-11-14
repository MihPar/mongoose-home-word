import { sessionService } from './../Bisnes-logic-layer/sessionService';
import  jwt  from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express'
import { HTTP_STATUS } from '../utils'
import { userService } from '../Bisnes-logic-layer/userService';
import {config} from'dotenv'
import { ObjectId } from 'mongodb';
config();

export const checkRefreshTokenMiddleware = async function(req: Request, res: Response, next: NextFunction) {
	const refreshToken = req.cookies.refreshToken
	// console.log('refreshToken:', refreshToken)
	if(!refreshToken) {
		res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
		return
	}
	try {
		const result: any = await jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET!)
		// console.log('after verify', result)
		if(result.userId){
			const user = await userService.findUserById(new ObjectId(result.userId))
			// console.log('user:', user)
			if(!user) {
				return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
			}
			const isInBlackList = await sessionService.findRefreshToken(refreshToken)
			// console.log('in black list', isInBlackList)
			if(isInBlackList) {
				return res
				.status(HTTP_STATUS.NOT_AUTHORIZATION_401)
				.send({message: 'It isn`t valid refresh token'})
			}
			req.user = user
			next()
			return
		}
		return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401) 
	} catch(err) {
		// console.log('error in verify:', err)
		return res.sendStatus(HTTP_STATUS.NOT_AUTHORIZATION_401)
	}
}