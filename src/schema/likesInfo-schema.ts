import { WithId } from "mongodb";
import mongoose from "mongoose";
import { LikeStatusEnum } from "../enum/like-status-enum";
import { Like } from "../types/likesInfoType";

export const LikesInfoSchema = new mongoose.Schema<WithId<Like>>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  commentId: { type: String, nullable: true },
  postId: {type: String, nullable: true},
  myStatus: {
    type: String,
    default: LikeStatusEnum.None,
	enum: ["None", "Like", "Dislike"]
  },
  addedAt: {type: String, required: true}
});