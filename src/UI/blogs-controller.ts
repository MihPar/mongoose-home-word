import { bodyPostsModel } from "../model/modePosts.ts/bodyPostsMode";
import { Posts } from "./types/postsTypes";
import { queryPostsModel } from "../model/modePosts.ts/queryPostsModel";
import { paramsPostsModelBlogId } from "../model/modePosts.ts/paramsPostsModeBlogId";
import { postsRepositories } from "../DataAccessLayer/posts-db-repositories";
import { paramsBlogsModel } from "../model/modelBlogs/paramsBlogsModel";
import {
  RequestWithParamsAndQuery,
  RequestWithParamsAndBody,
  RequestWithParams,
  PaginationType,
} from "./types/types";
import { postsService } from "../Bisnes-logic-layer/postsService";
import {
  inputBlogNameValidator,
  inputBlogDescription,
  inputBlogWebsiteUrl,
} from "../middleware/input-value-blogs-middleware";
import { authorization } from "../middleware/authorizatin";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { blogsService } from "../Bisnes-logic-layer/blogsService";
import { Router, Response } from "express";
import { HTTP_STATUS } from "../utils";
import { RequestWithBody, RequestWithQuery } from "./types/types";
import {
  inputPostContentValidator,
  inputPostShortDescriptionValidator,
  inputPostTitleValidator,
} from "../middleware/input-value-posts-middleware";
import { QueryBlogsModel } from "../model/modelBlogs/QueryBlogsModel";
import { bodyBlogsModel } from "../model/modelBlogs/bodyBlogsModel";
import { blogsRepositories } from "../DataAccessLayer/blogs-db-repositories";
import { Blogs } from "./types/blogsType";

export const blogsRouter = Router({});

class BlogsComtroller {
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
      await blogsRepositories.findAllBlogs(
        searchNameTerm,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
      );
    return res.status(HTTP_STATUS.OK_200).send(getAllBlogs);
  }
  async createBlog(req: RequestWithBody<bodyBlogsModel>, res: Response<Blogs>) {
    const createBlog: Blogs = await blogsService.createNewBlog(
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

    const { blogId } = req.params;

    const blog = await blogsRepositories.findBlogById(blogId);
    if (!blog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);

    const getPosts: PaginationType<Posts> =
      await postsRepositories.findPostsByBlogsId(
        pageNumber as string,
        pageSize as string,
        sortBy as string,
        sortDirection as string,
        blogId as string
      );
    return res.status(HTTP_STATUS.OK_200).send(getPosts);
  }
  async createBlogsByBlogsIdPost(
    req: RequestWithParamsAndBody<paramsPostsModelBlogId, bodyPostsModel>,
    res: Response<Posts>
  ): Promise<Response<Posts>> {
    const { blogId } = req.params;
    const { title, shortDescription, content } = req.body;

    const blog = await blogsRepositories.findBlogById(blogId);
    if (!blog) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);

    const isCreatePost = await postsService.createPost(
      blogId,
      title,
      shortDescription,
      content
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
    const blogById: Blogs | null = await blogsRepositories.findBlogById(
      req.params.id
    );
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
    const isUpdateBlog: boolean = await blogsService.updateBlog(
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
    const isDeleted: boolean = await blogsRepositories.deletedBlog(
      req.params.id
    );
    if (!isDeleted) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
}

export const blogsComtroller = new BlogsComtroller();

blogsRouter.get("/", blogsComtroller.getBlogs);
blogsRouter.post(
  "/",
  authorization,
  inputBlogNameValidator,
  inputBlogDescription,
  inputBlogWebsiteUrl,
  ValueMiddleware,
  blogsComtroller.createBlog
);
blogsRouter.get("/:blogId/posts", blogsComtroller.getBlogsByPostIdPost);
blogsRouter.post(
  "/:blogId/posts",
  authorization,
  inputPostContentValidator,
  inputPostTitleValidator,
  inputPostShortDescriptionValidator,
  ValueMiddleware,
  blogsComtroller.createBlogsByBlogsIdPost
);
blogsRouter.get("/:id", blogsComtroller.getPostById);
blogsRouter.put(
  "/:id",
  authorization,
  inputBlogNameValidator,
  inputBlogDescription,
  inputBlogWebsiteUrl,
  ValueMiddleware,
  blogsComtroller.updateBlogsById
);
blogsRouter.delete("/:id", authorization, blogsComtroller.deleteBlogsById);
