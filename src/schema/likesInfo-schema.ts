import { WithId } from "mongodb";
import mongoose from "mongoose";
import { LikeStatusEnum } from "../enum/like-status-enum";
import { LikesInfo } from "../types/likesInfoType";

export const LikesInfoSchema = new mongoose.Schema<WithId<LikesInfo>> ({
	userId: {type: mongoose.Schema.Types.ObjectId, required: true},
	commentId: {type: String, required: true},
	likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    myStatus: LikeStatusEnum
})