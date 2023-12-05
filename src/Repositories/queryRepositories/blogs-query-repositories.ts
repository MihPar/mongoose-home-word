import { ObjectId } from "mongodb";
import { BlogsModel } from "../../db/db";
import { Blogs, BlogsDB } from "../../types/blogsType";
import { PaginationType } from "../../types/types";

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
	  async findBlogById(id: string): Promise<Blogs | null> {
		return await BlogsModel.findOne({ _id: new ObjectId(id) }, { _v: 0 });
	  }
	  async findBlogs(): Promise<Blogs[]> {
		const filtered: any = {};
		return await BlogsModel.find(filtered, { projection: { _id: 0 } }).lean();
	  }
}