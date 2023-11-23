import { WithId } from "mongodb";
import mongoose from "mongoose";
import { LikeStatusEnum } from "../enum/like-status-enum";
import { LikesInfo } from "../types/likesInfoType";

export const LikesInfoSchema = new mongoose.Schema<WithId<LikesInfo>> ({
	likesCount: {type: Number, required: true},
    dislikesCount: {type: Number, required: true},
    myStatus: LikeStatusEnum
})