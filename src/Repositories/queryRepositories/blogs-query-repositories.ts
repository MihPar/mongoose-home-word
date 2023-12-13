import { ObjectId } from "mongodb";
import { BlogsModel, LikesModel } from "../../db/db";
import { Blogs, BlogsDB } from "../../types/blogsType";
import { PaginationType } from "../../types/types";
import { LikeStatusEnum } from "../../enum/like-status-enum";

export class QueryBlogsRepositories {
	async findAllBlogs(
		searchNameTerm: string | null,
		pageNumber: string,
		pageSize: string,
		sortBy: string,
		sortDirection: string
	  ): Promise<PaginationType<Blogs>> {
		const filtered = searchNameTerm
		  ? { name: { $regex: searchNameTerm ?? '', $options: 'i' } }
		  : {}; // todo finished filter
		const blogs: BlogsDB[] = await BlogsModel
		  .find(filtered, { __v: 0 } )
		  .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
		  .skip((+pageNumber - 1) * +pageSize) //todo find how we can skip
		  .limit(+pageSize)
		  .lean();
	
		const totalCount: number = await BlogsModel.countDocuments(filtered);
		const pagesCount: number = Math.ceil(totalCount / +pageSize);
		
		const result: PaginationType<Blogs> = {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: totalCount,
			items: blogs.map((item) => BlogsDB.getBlogsViewModel(item)),
		}
		return result
	  }
	  async findBlogById(id: string, userId?: string): Promise<Blogs | null> {
		const blog =  await BlogsModel.findOne({ _id: new ObjectId(id) }, {__v: 0}).lean();
		const newestLikes = await LikesModel.find({postId:id, myStatus: LikeStatusEnum.Like}).sort({addedAt: -1}).limit(3).skip(0).lean()
		let myStatus : LikeStatusEnum = LikeStatusEnum.None;
		if(userId){
			const reaction = await LikesModel.findOne({postId: id, userId: new ObjectId(userId)})
			myStatus = reaction ? reaction.myStatus : LikeStatusEnum.None
		}
		return blog ? BlogsDB.getBlogsViewModel(blog) : null;
	  }
	  async findBlogs(): Promise<Blogs[]> {
		const filtered: any = {};
		return await BlogsModel.find(filtered, { projection: { _id: 0 } }).lean();
	  }
}