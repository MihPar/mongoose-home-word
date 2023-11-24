import { WithId } from "mongodb";
import mongoose from "mongoose";
import { LikeStatusEnum } from "../enum/like-status-enum";
import { LikesInfo } from "../types/likesInfoType";

export const LikesInfoSchema = new mongoose.Schema<WithId<LikesInfo>>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  commentId: { type: String, required: true },
  myStatus: {
    type: String,
    default: LikeStatusEnum.None,
    enum: Object.values(LikeStatusEnum)
  },
});