import { bodyPostsModel } from "../model/modePosts.ts/bodyPostsMode";
import { Posts } from "../types/postsTypes";
import { queryPostsModel } from "../model/modePosts.ts/queryPostsModel";
import { paramsPostsModelBlogId } from "../model/modePosts.ts/paramsPostsModeBlogId";
import { paramsBlogsModel } from "../model/modelBlogs/paramsBlogsModel";
import {
  RequestWithParamsAndQuery,
  RequestWithParamsAndBody,
  RequestWithParams,
  PaginationType,
} from "../types/types";
import { PostsService } from "../Service/postsService";
import { BlogsService } from "../Service/blogsService";
import { Response } from "express";
import { HTTP_STATUS } from "../utils/utils";
import { RequestWithBody, RequestWithQuery } from "../types/types";
import { QueryBlogsModel } from "../model/modelBlogs/QueryBlogsModel";
import { bodyBlogsModel } from "../model/modelBlogs/bodyBlogsModel";
import { BlogsRepositories } from "../Repositories/blogs-db-repositories";
import { Blogs } from "../types/blogsType";
import { PostsRepositories } from "../Repositories/posts-db-repositories";
import { QueryBlogsRepositories } from "../Repositories/queryRepositories/blogs-query-repositories";
import { QueryPostsRepositories } from "../Repositories/queryRepositories/posts-query-repositories";


export class BlogsComtroller {
  constructor(
    protected blogsService: BlogsService,
    protected blogsRepositories: BlogsRepositories,
    protected postsService: PostsService,
    protected postsRepositories: PostsRepositories,
    protected queryBlogsRepositories: QueryBlogsRepositories,
    protected queryPostsRepositories: QueryPostsRepositories
  ) {}
  async getBlogs(
    req: RequestWithQuery<QueryBlogsModel>,
    res: Response<PaginationType<Blogs>>
  ): Promise<Response<PaginationType<Blogs>>> {
    const {
      searchNameTerm,
      pageNumber = "1",
      pageSize = "10",
      sortBy = "createdAt",
      sortDirection = "desc",
    } = req.query;
    const getAllBlogs: PaginationType<Blogs> =
      await this.queryBlogsRepositories.findAllBlogs(
        searchNameTerm,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
      );
    return res.status(HTTP_STATUS.OK_200).send(getAllBlogs);
  }
  async createBlog(req: RequestWithBody<bodyBlogsModel>, res: Response<Blogs>) {
    const createBlog: Blogs = await this.blogsService.createNewBlog(
      req.body.name,
      req.body.description,
      req.body.websiteUrl
    );
    return res.status(HTTP_STATUS.CREATED_201).send(createBlog);
  }
  async getBlogsByPostIdPost(
    req: RequestWithParamsAndQuery<paramsPostsModelBlogId, queryPostsModel>,
    res: Response<PaginationType<Posts>>
  ) {
    const {
      pageNumber = "1",
      pageSize = "10",
      sortBy = "createdAt",
      sortDirection = "desc",
    } = req.query;

	const userId = req.user?.id ?? null;
    const { blogId } = req.params;
	console.log(blogId)

    const blog = await this.queryBlogsRepositories.findBlogById(blogId);
    if (!blog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);

    const getPosts: PaginationType<Posts> =
      await this.queryPostsRepositories.findPostsByBlogsId(
        pageNumber as string,
        pageSize as string,
        sortBy as string,
        sortDirection as string,
        blogId as string,
		userId as string
      );
    return res.status(HTTP_STATUS.OK_200).send(getPosts);
  }
  async createBlogsByBlogsIdPost(
    req: RequestWithParamsAndBody<paramsPostsModelBlogId, bodyPostsModel>,
    res: Response<Posts>
  ): Promise<Response<Posts>> {
    const { blogId } = req.params;
    const { title, shortDescription, content } = req.body;

    const blog = await this.queryBlogsRepositories.findBlogById(blogId);
    if (!blog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);

    const isCreatePost = await this.postsService.createPost(
      blogId,
      title,
      shortDescription,
      content,
	  blog.name
    );
    if (!isCreatePost) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.status(HTTP_STATUS.CREATED_201).send(isCreatePost);
    }
  }
  async getPostById(
    req: RequestWithParams<paramsBlogsModel>,
    res: Response<Blogs | null>
  ) {
    const blogById: Blogs | null =
      await this.queryBlogsRepositories.findBlogById(req.params.id);
    if (!blogById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(blogById);
    }
  }
  async updateBlogsById(
    req: RequestWithParamsAndBody<paramsBlogsModel, bodyBlogsModel>,
    res: Response<void>
  ) {
    const { id } = req.params;
    const { name, description, websiteUrl } = req.body;
    const isUpdateBlog: boolean = await this.blogsService.updateBlog(
      id,
      name,
      description,
      websiteUrl
    );
    if (!isUpdateBlog) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
  async deleteBlogsById(
    req: RequestWithParams<paramsBlogsModel>,
    res: Response<void>
  ) {
    const isDeleted: boolean = await this.blogsRepositories.deletedBlog(
      req.params.id
    );
    if (!isDeleted) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } 
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    
  }
}
