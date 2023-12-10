import { ObjectId } from "mongodb"
import { LikeStatusEnum } from "../enum/like-status-enum"

export type likeInfoType = {
	likesCount: number
    dislikesCount: number
    myStatus: LikeStatusEnum
}

export class LikesInfoClass {
  constructor(
    public likesCount: number,
    public dislikesCount: number,
    public myStatus: LikeStatusEnum
  ) {}
}

  export class Like {
    constructor(
	  public _id: ObjectId,
	  public userId: ObjectId,
	  public commentId: String,
	  public postId: String,
      public myStatus: LikeStatusEnum,
    ) {}
  }

// export class Like {
//     addedAt: string

//     constructor(public userId: ObjectId,
//                 public parentId: string,
//                 public myStatus: LikeStatusEnum,
//                 public userName: string) {

//         this.addedAt = new Date().toISOString()
//     }

//     static checkUserLike(likes: LikeModel[], userId: ObjectId) {
//         const like = likes.find(like => like.userId.equals(new ObjectId(userId)))
//         if (!like) return null
//         return like
//     }

//     static likeStatusCheck(like: LikeModel, body: LikeStatusEnum) {
//         if (like.myStatus === body) {
//             return null
//         }
//         return {
//             userId: like.userId,
//             parentId: like.parentId,
//             addedAt: like.addedAt,
//             userName: like.userName,
//             myStatus: body
//         }

//     }
// }

export type newestLikesType = {
    addedAt: string,
    userId: ObjectId,
    login: string
}

export interface LikeModel {
    userId: ObjectId
    parentId: string
    addedAt: string
    userName: string
    myStatus: LikeStatusEnum
}


  export interface LikesInfoModel {
    dislikesCount: number
    likesCount: number
    myStatus: LikeStatusEnum
    newestLikes?: newestLikesType[]
}