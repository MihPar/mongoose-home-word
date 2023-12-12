import { ObjectId } from "mongodb";
import { LikesModel, PostsModel } from "../../db/db";
import { Posts, PostsDB } from "../../types/postsTypes";
import { PaginationType } from "../../types/types";
import { LikeStatusEnum } from "../../enum/like-status-enum";

export class QueryPostsRepositories {
  async findAllPosts(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
	userId: string
  ): Promise<PaginationType<Posts>> {
    const filtered = {};
    const allPosts: PostsDB[] = await PostsModel.find(filtered, {__v: 0 })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize)
      .limit(+pageSize)
      .lean();

    const totalCount: number = await PostsModel.countDocuments(filtered);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

    let result: PaginationType<Posts> = {
      pagesCount: pagesCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: totalCount,
      items: await Promise.all(allPosts.map(async(allPOsts) => {
		const newestLikes = await LikesModel
		.find({postId: allPOsts._id.toString()})
		.sort({addedAt: -1})
		.limit(3)
		.skip(0)
		.lean()
		let myStatus : LikeStatusEnum = LikeStatusEnum.None;
		if(userId){
			const reaction = await LikesModel.findOne({postId: allPOsts._id.toString()}, {userId: userId})
			myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None
	}			
		return PostsDB.getPostsViewModel(allPOsts, myStatus, newestLikes)
	}
		),)
    };
    return result;
  }
  async findPostsByBlogsId(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    blogId: string,
	userId: string
  ): Promise<PaginationType<Posts>> {
    const filter = { blogId: blogId };
    const posts: PostsDB[] = await PostsModel.find(filter, {__v: 0 })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize) //todo find how we can skip
      .limit(+pageSize)
      .lean();
    const totalCount: number = await PostsModel.countDocuments(filter);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

		const result: PaginationType<Posts> = {
		pagesCount: pagesCount,
		page: +pageNumber,
		pageSize: +pageSize,
		totalCount: totalCount,
		items: await Promise.all(posts.map(async(post)=> {
			const newestLikes = await LikesModel
			.find({postId: post._id.toString()})
			.sort({addedAt: -1})
			.limit(3)
			.skip(0)
			.lean()
			let myStatus : LikeStatusEnum = LikeStatusEnum.None;
			if(userId){
				const reaction = await LikesModel.findOne({postId: post._id.toString()}, {userId: userId})
				myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None
		}			
			return PostsDB.getPostsViewModel(post, myStatus, newestLikes)
		}))
	  };

    return result
  }
  async findPostById(id: string, userId?: string): Promise<Posts | null> {
    const post = await PostsModel.findOne({ _id: new ObjectId(id) }, {__v: 0 }).lean();
	const newestLikes = await LikesModel.find({postId:id}).sort({addedAt: -1}).limit(3).skip(0).lean()
	let myStatus : LikeStatusEnum = LikeStatusEnum.None;
	if(userId){
		const reaction = await LikesModel.findOne({postId: id}, {userId: userId})
		myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None
	}
	return post ? PostsDB.getPostsViewModel(post, myStatus, newestLikes) : null
  }
//   async findPostByPostId(postId: string, userId: Object | null): Promise<PostsViewModel | null> {
// 	const findPost: PostsDB | null = await PostsModel.findOne({_id: new ObjectId(postId)})
// 	if (!findPost) return null
//const newestLikes = await
//
// 	return findPost.getPostViewModel()
//   }
}