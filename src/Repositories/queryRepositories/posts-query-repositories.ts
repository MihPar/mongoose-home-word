import { ObjectId } from "mongodb";
import { PostsModel } from "../../db/db";
import { Posts, PostsDB } from "../../types/postsTypes";
import { PaginationType } from "../../types/types";

export class QueryPostsRepositories {
  async findAllPosts(
    pageNumber: string,
    pageSize: string,
    sortBy: string,
    sortDirection: string
  ): Promise<PaginationType<Posts>> {
    const filtered = {};
    const allPosts = await PostsModel.find(filtered, { projection: { _id: 0 } })
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
      items: allPosts,
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

    // console.log(filter);
    // console.log({ [sortBy]: sortDirection === "asc" ? 1 : -1 });
    // console.log((+pageNumber - 1) * +pageSize);
    // console.log(+pageSize);

    const posts = await PostsModel.find(filter, { projection: { _id: 0 } })
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
    };
  }
  async findPostById(id: string): Promise<PostsDB | null> {
    return await PostsModel.findOne({ _id: new ObjectId(id) }, { projection: { _id: 0 } });
  }
}