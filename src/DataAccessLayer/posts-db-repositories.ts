import { PostsModel } from './../db/db';
import { PostsType } from './../UI/types/postsTypes';
import { PaginationType } from './../UI/types/types';
import { Filter } from "mongodb";

export const postsRepositories = {
	async findAllPosts(
		pageNumber: string,
		pageSize: string,
		sortBy: string,
		sortDirection: string
	  ): Promise<PaginationType<PostsType>> {
		const filtered: Filter<PostsType> = {};
		const allPosts = await PostsModel
		  .find(filtered, { projection: { _id: 0 } })
		  .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
		  .skip((+pageNumber - 1) * +pageSize)
		  .limit(+pageSize)
		  .lean();
	
		const totalCount: number = await PostsModel.countDocuments(filtered);
		const pagesCount: number = Math.ceil(totalCount / +pageSize);

		let result: PaginationType<PostsType> = {
			pagesCount: pagesCount,
			page: +pageNumber,
			pageSize: +pageSize,
			totalCount: totalCount,
			items: allPosts,
		}
		return result
	  },
  async createNewBlogs(newPost: PostsType): Promise<PostsType> {
    const result = await PostsModel.insertMany({ ...newPost });
    return newPost;
  },
  async findPostsByBlogsId(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    blogId: string
  ): Promise<PaginationType<PostsType>> {
    const filter: Filter<PostsType> = { blogId: blogId };

	console.log(filter)
	console.log({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
	console.log((+pageNumber - 1) * +pageSize)
	console.log(+pageSize)

    const posts = await PostsModel
      .find(filter, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize) //todo find how we can skip
      .limit(+pageSize)
      .lean();
    const totalCount: number = await PostsModel.countDocuments(filter);
    const pagesCount: number = Math.ceil(totalCount / +pageSize);

	return {
		pagesCount: pagesCount,
		page: +pageNumber,
		pageSize: +pageSize,
		totalCount: totalCount,
		items: posts,
	}
  },
  async findPostById(id: string): Promise<PostsType | null> {
    return await PostsModel.findOne({ id: id }, { projection: { _id: 0 } });
  },
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    const result = await PostsModel.updateOne(
      { id: id },
      {
        $set: {
          title: title,
          shortDescription: shortDescription,
          content: content,
          blogId: blogId,
        },
      }
    );
    return result.matchedCount === 1;
  },
  async deletedPostById(id: string): Promise<boolean> {
    const result = await PostsModel.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
  async deleteRepoPosts(): Promise<boolean> {
    const deletedAll = await PostsModel.deleteMany({});
    return deletedAll.acknowledged
  },
};
