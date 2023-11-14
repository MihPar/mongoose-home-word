import { ObjectId } from 'mongodb';
import { sessionRepositories } from "../DataAccessLayer/session-db-repositories"
import { BlackList } from '../UIRepresentation/types/sessionTypes';

export const sessionService = {
	async findRefreshToken(refreshToken: string) {
		const findRefreshToken = await sessionRepositories.findRefreshToken(refreshToken)
		return findRefreshToken
	},
	async updateSession(currentUserId: ObjectId, newRefreshToken: string) {
		return await sessionRepositories.addRefreshToken(currentUserId, newRefreshToken)
	},
	async addRefreshToken(refreshToken: string) {
		const newRefreshToken: BlackList = {
			refreshToken
		}
		const addToBlackListRefreshToken = await sessionRepositories.addToBlackList(newRefreshToken)
		return addToBlackListRefreshToken
	}
}