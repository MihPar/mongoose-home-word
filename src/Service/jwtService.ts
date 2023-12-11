import jwt  from 'jsonwebtoken';
import { Users } from '../types/userTypes';
import dotenv from 'dotenv'
import { ObjectId } from 'mongodb';
dotenv.config()

export class JWTService {
	async createJWT(user: Users) {
		const token: string = await jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {expiresIn: '5m'})
		return token
	}
	async createRefreshJWT(userId: string, existDeviceId?: ObjectId) {
		const deviceId: ObjectId = new ObjectId()
		const refreshToken: string = await jwt.sign({deviceId: existDeviceId ?? deviceId, userId}, process.env.REFRESH_JWT_SECRET as string, {expiresIn: '10m'})
		return refreshToken
	}
	async getUserIdByToken(token: string) {
		try {
			const result: any = await jwt.verify(token, process.env.JWT_SECRET!)
			return new ObjectId(result.userId)
		} catch(err) {
			return null
		}
	}
	async getUserIdByRefreshToken(refreshToken: string) {
		try {
			 const result: any = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET!)
			 return new ObjectId(result.userId)
		} catch(err) {
			return null
		}
	}
	async decodeRefreshToken(refreshToken: string): Promise<jwt.JwtPayload | null> {
		try {
			 const result = jwt.decode(refreshToken)
			 return result as jwt.JwtPayload
		} catch(err) {
			return null
		}
	}
	getLastActiveDate(token: string) {
		const result: any = jwt.decode(token)
		return new Date(result.iat * 1000).toISOString()
	}
}
