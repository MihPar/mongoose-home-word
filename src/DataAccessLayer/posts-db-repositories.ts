import { PostsType } from '../UIRepresentation/types/postsType';
import { PaginationType} from '../UIRepresentation/types/types';
import { postsCollection } from "../db/db";
import { Filter } from "mongodb";

export const postsRepositories = {
	async findAllPosts(
		pageNumber: string,
		pageSize: string,
		sortBy: string,
		sortDirection: string
	  ): Promise<PaginationType<PostsType>> {
		const filtered: Filter<PostsType> = {};
		const allPosts = await postsCollection
		  .find(filtered, { projection: { _id: 0 } })
		  .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
		  .skip((+pageNumber - 1) * +pageSize)
		  .limit(+pageSize)
		  .toArray();
	
		const totalCount: number = await postsCollection.countDocuments(filtered);
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
    const result = await postsCollection.insertOne({ ...newPost });
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

    const posts = await postsCollection
      .find(filter, { projection: { _id: 0 } })
      .sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .skip((+pageNumber - 1) * +pageSize) //todo find how we can skip
      .limit(+pageSize)
      .toArray();
    const totalCount: number = await postsCollection.countDocuments(filter);
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
    return await postsCollection.findOne({ id: id }, { projection: { _id: 0 } });
  },
  async updatePost(
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string
  ): Promise<boolean> {
    const result = await postsCollection.updateOne(
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
    const result = await postsCollection.deleteOne({ id: id });
    return result.deletedCount === 1;
  },
  async deleteRepoPosts(): Promise<boolean> {
    const deletedAll = await postsCollection.deleteMany({});
    return deletedAll.acknowledged
  },
};
