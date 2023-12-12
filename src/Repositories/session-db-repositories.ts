import { DevicesModel } from "../db/db";
import { ObjectId } from "mongodb";

export class SessionRepositories {
  async findRefreshToken(refreshToken: string) {
    const result = await DevicesModel.findOne({
      refreshToken: refreshToken,
    }, {__v: 0}).lean();
    return result;
  }
  async addRefreshToken(currentUserId: ObjectId, newRefreshToken: string) {
    const result = await DevicesModel.updateOne(
      { _id: currentUserId },
      { $push: { sessionToken: newRefreshToken } }
    );
  }
}
