import { blackCollection, deviceAuthSessionCollection } from './../db/db';
import { BlackList } from '../UIRepresentation/types/sessionTypes';
import { ObjectId } from "mongodb";

export const sessionRepositories = {
  async findRefreshToken(refreshToken: string) {
    const result = await deviceAuthSessionCollection.findOne({
		refreshToken: refreshToken,
    });
    return result;
  },
  async addRefreshToken(currentUserId: ObjectId, newRefreshToken: string) {
    const result = await deviceAuthSessionCollection.updateOne(
      { _id: currentUserId },
      { $push: { sessionToken: newRefreshToken } }
    );
  },
  async addToBlackList(newRefreshToken: BlackList): Promise<boolean> {
	const result = await blackCollection.insertOne({...newRefreshToken})
	if(result) {
		return true
	} else {
		return false
	}
  }
};
