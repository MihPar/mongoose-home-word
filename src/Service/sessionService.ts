// import { BlackList } from './../UI/types/sessionTypes';
import { ObjectId } from 'mongodb';
import { SessionRepositories } from "../Repositories/session-db-repositories"

export class SessionService {
	sessionRepositories: SessionRepositories
	constructor() {
		this.sessionRepositories = new SessionRepositories()
	}
	async findRefreshToken(refreshToken: string) {
		const findRefreshToken = await this.sessionRepositories.findRefreshToken(refreshToken)
		return findRefreshToken
	}
	async updateSession(currentUserId: ObjectId, newRefreshToken: string) {
		return await this.sessionRepositories.addRefreshToken(currentUserId, newRefreshToken)
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

// export const sessionService = new SessionService()