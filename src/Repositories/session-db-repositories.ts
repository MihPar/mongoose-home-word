import { DevicesModel } from "../db/db";
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
}
