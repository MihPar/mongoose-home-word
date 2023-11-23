import { BlogsModel } from "../../db/db";
import { Blogs } from "../../types/blogsType";
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
		const blogs: Blogs[] = await BlogsModel
		  .find(filtered, { projection: { _id: 0 } })
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
			items: blogs,
		}
		return result
	  }
	  async findBlogById(blogId: string): Promise<Blogs | null> {
		return await BlogsModel.findOne({ id: blogId }, { projection: { _id: 0 } });
	  }
	  async findBlogs(): Promise<Blogs[]> {
		const filtered: any = {};
		return await BlogsModel.find(filtered, { projection: { _id: 0 } }).lean();
	  }
}