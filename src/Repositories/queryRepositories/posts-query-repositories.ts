import { ObjectId, WithId } from "mongodb";
import { PostsModel } from "../../db/db";
import { Posts, PostsDB, PostsViewModel } from "../../types/postsTypes";
import { PaginationType } from "../../types/types";

export class QueryPostsRepositories {
  async findAllPosts(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string
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
      items: allPosts.map((item) => PostsDB.getPostsViewModel(item)),
    };
    return result;
  }
  async findPostsByBlogsId(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string,
    blogId: string
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
		items: posts.map((item) => PostsDB.getPostsViewModel(item)),
	  };

    return result
  }
  async findPostById(id: string): Promise<Posts | null> {
    const post = await PostsModel.findOne({ _id: new ObjectId(id) }, {__v: 0 }).lean();
	return post ? PostsDB.getPostsViewModel(post) : null
  }
//   async findPostByPostId(postId: string, userId: Object | null): Promise<PostsViewModel | null> {
// 	const findPost: PostsDB | null = await PostsModel.findOne({_id: new ObjectId(postId)})
// 	if (!findPost) return null
// 	return findPost.getPostViewModel()
//   }
}