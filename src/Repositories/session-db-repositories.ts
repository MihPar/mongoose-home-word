// import { BlackList } from './../UI/types/sessionTypes';
import { DevicesModel} from '../db/db';
import { ObjectId } from "mongodb";

export class SessionRepositories {
	async findRefreshToken(refreshToken: string) {
		const result = await DevicesModel.findOne({
			refreshToken: refreshToken,
		});
		return result;
	  }
	  async addRefreshToken(currentUserId: ObjectId, newRefreshToken: string) {
		const result = await DevicesModel.updateOne(
		  { _id: currentUserId },
		  { $push: { sessionToken: newRefreshToken } }
		);
	  }
	//   async addToBlackList(newRefreshToken: BlackList): Promise<boolean> {
	// 	const result = await BlackListMode.insertMany([newRefreshToken])
	// 	if(result) {
	// 		return true
	// 	} else {
	// 		return false
	// 	}
	//   }
}

// export const sessionRepositories = new SessionRepositories()
  
 
