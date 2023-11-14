import { BlogsModel } from './../db/db';
import { BlogsType } from './../UI/types/blogsType';
import { PaginationType } from './../UI/types/types';
import { Filter } from "mongodb";

export const blogsRepositories = {
  async findAllBlogs(
    searchNameTerm: string | null,
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string
  ): Promise<PaginationType<BlogsType>> {
    const filtered: Filter<BlogsType> = searchNameTerm
      ? { name: { $regex: searchNameTerm ?? '', $options: 'i' } }
      : {}; // todo finished filter
    const blogs: BlogsType[] = await BlogsModel
      .find(filtered, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize) //todo find how we can skip
      .limit(+pageSize)
      .lean();

    const totalCount: number = await BlogsModel.countDocuments(filtered);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);
	
	const result: PaginationType<BlogsType> = {
		pagesCount: pagesCount,
		page: +pageNumber,
		pageSize: +pageSize,
		totalCount: totalCount,
		items: blogs,
	}
    return result
  },
  async findBlogById(blogId: string): Promise<BlogsType | null> {
    return await BlogsModel.findOne({ id: blogId }, { projection: { _id: 0 } });
  },
  async findBlogs(): Promise<BlogsType[]> {
    const filtered: any = {};
    return await BlogsModel.find(filtered, { projection: { _id: 0 } }).lean();
  },
  async createNewBlogs(newBlog: BlogsType): Promise<BlogsType> {
    const result = await BlogsModel.insertMany({ ...newBlog });
    return newBlog;
  },
  async updateBlogById(
    id: string,
    name: string,
    description: string,
    websiteUrl: string
  ): Promise<boolean> {
    const result = await BlogsModel.updateOne(
      { id: id },
      { $set: { name: name, description: description, websiteUrl: websiteUrl } }
    );
    return result.modifiedCount === 1;
  },
  async deletedBlog(id: string): Promise<boolean> {
    const result = await BlogsModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
  async deleteRepoBlogs(): Promise<boolean> {
    const deletedAll = await BlogsModel.deleteMany({});
    return deletedAll.deletedCount === 1;
  },
};
