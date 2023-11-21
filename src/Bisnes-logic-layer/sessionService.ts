// import { BlackList } from './../UI/types/sessionTypes';
import { ObjectId } from 'mongodb';
import { sessionRepositories } from "../DataAccessLayer/session-db-repositories"

class SessionService {
	async findRefreshToken(refreshToken: string) {
		const findRefreshToken = await sessionRepositories.findRefreshToken(refreshToken)
		return findRefreshToken
	}
	async updateSession(currentUserId: ObjectId, newRefreshToken: string) {
		return await sessionRepositories.addRefreshToken(currentUserId, newRefreshToken)
	}
	// async addRefreshToken(refreshToken: string) {
	// 	const newRefreshToken: BlackList  = {
	// 		_id: new ObjectId(),
	// 		refreshToken
	// 	}
	// 	const addToBlackListRefreshToken = await sessionRepositories.addToBlackList(newRefreshToken)
	// 	return addToBlackListRefreshToken
	// }
}

export const sessionService = new SessionService()