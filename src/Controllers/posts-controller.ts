import { RequestWithParamsAndBody } from './../types/types';
import { postsService } from './../Compositions-root/posts-composition-root';
import { paramsIdModel } from '../model/modePosts.ts/paramsIdModel';
import { bodyPostsModel } from '../model/modePosts.ts/bodyPostsMode';
import { bodyPostModelContent } from '../model/modePosts.ts/bodyPostModeContent';
import { PostsRepositories } from '../Repositories/posts-db-repositories';
import { queryPostsModel } from '../model/modePosts.ts/queryPostsModel';
import { ParamsPostIdMode, paramsPostIdMode } from '../model/modePosts.ts/paramsPostIdMode';
import {
  RequestWithParams,
  RequestWithBody,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  PaginationType,
} from "../types/types";
import { Response } from "express";
import { HTTP_STATUS } from "../utils/utils";
import { Posts, PostsDB } from '../types/postsTypes';
import { CommentRepositories } from '../Repositories/comment-db-repositories';
import { CommentService } from '../Service/commentService';
import { PostsService } from '../Service/postsService';
import { QueryPostsRepositories } from '../Repositories/queryRepositories/posts-query-repositories';
import { QueryCommentRepositories } from '../Repositories/queryRepositories/comment-query-repositories';
import { CommentViewModel } from '../types/commentType';
import { LikeInputModel } from '../types/likesInfoType';
import { QueryUsersRepositories } from '../Repositories/queryRepositories/users-query-repositories';


export class PostsController {
  constructor(
    protected postsRepositories: PostsRepositories,
    protected commentRepositories: CommentRepositories,
	protected queryCommentRepositories: QueryCommentRepositories,
    protected commentService: CommentService,
    protected postsService: PostsService,
	protected queryPostsRepositories: QueryPostsRepositories,
	protected queryUsersRepositories: QueryUsersRepositories
  ) {
  }
  async getPostByPostId(
    req: RequestWithParamsAndQuery<paramsPostIdMode, queryPostsModel>,
    res: Response<PaginationType<CommentViewModel>>
  ) {
    const { postId } = req.params;
    const {
      pageNumber = "1",
      pageSize = "10",
      sortBy = "createdAt",
      sortDirection = "desc",
    } = req.query;
	const userId = req.user?.id ?? null;
    const isExistPots = await this.queryPostsRepositories.findPostById(postId);
    if (!isExistPots) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    const commentByPostsId: PaginationType<CommentViewModel> | null =
      await this.queryCommentRepositories.findCommentByPostId(
        postId,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
		userId
      );
    if (!commentByPostsId) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(commentByPostsId);
    }
  }
  async createCommentForPostByPostId(
    req: RequestWithParamsAndBody<paramsPostIdMode, bodyPostModelContent>,
    res: Response<CommentViewModel>
  ) {
    const { postId } = req.params;
    const { content } = req.body;
    const user = req.user;
    const post: Posts | null = await this.queryPostsRepositories.findPostById(
      postId
    );

    if (!post) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    const createNewCommentByPostId: CommentViewModel | null =
      await this.commentService.createNewCommentByPostId(
        postId,
        content,
        user._id.toString(),
        user.accountData.userName,
      );
    if (!createNewCommentByPostId) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.status(HTTP_STATUS.CREATED_201).send(createNewCommentByPostId);
    }
  }
  async getPosts(
    req: RequestWithParams<queryPostsModel>,
    res: Response<PaginationType<Posts>>
  ): Promise<Response<PaginationType<Posts>>> {
    const {
      pageNumber = "1",
      pageSize = "10",
      sortBy = "createdAt",
      sortDirection = "desc",
    } = req.query;
    const getAllPosts: PaginationType<Posts> =
      await this.queryPostsRepositories.findAllPosts(
        pageNumber as string,
        pageSize as string,
        sortBy as string,
        sortDirection as string
      );
    return res.status(HTTP_STATUS.OK_200).send(getAllPosts);
  }
  async createPost(req: RequestWithBody<bodyPostsModel>, res: Response<Posts>) {
    const { title, shortDescription, content, blogId } = req.body;
	const blog = req.blog
    const createNewPost: Posts | null = await this.postsService.createPost(
      blogId,
      title,
      shortDescription,
      content,
	  blog!.name
    );
    if (!createNewPost) {
      return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
    } else {
      return res.status(HTTP_STATUS.CREATED_201).send(createNewPost);
    }
  }
  async getPostById(
    req: RequestWithParams<paramsIdModel>,
    res: Response<Posts | null>
  ) {
    const getPostById: Posts | null = await this.queryPostsRepositories.findPostById(
      req.params.id
    );
    if (!getPostById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(getPostById);
    }
  }
  async updatePostById(
    req: RequestWithParamsAndBody<paramsIdModel, bodyPostsModel>,
    res: Response<boolean>
  ) {
    const { id } = req.params;
    const { title, shortDescription, content, blogId } = req.body;
    const updatePost: boolean = await this.postsService.updateOldPost(
      id,
      title,
      shortDescription,
      content,
      blogId
    );
    if (!updatePost) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
  async updateLikeStatus(req: RequestWithParamsAndBody<ParamsPostIdMode, LikeInputModel>, res: Response) {
	const postId = req.params.postId
	const { _id } = req.user;
	const findPost = await this.queryPostsRepositories.findPostByPostId(postId, _id)
	if(!findPost) {
		return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
	}
	const result = await this.postsService.updateLikeDislike(req.body, postId, _id)
  }
  async deletePostById(
    req: RequestWithParams<paramsIdModel>,
    res: Response<void>
  ) {
	console.log(req.params.id)
    const deletPost: boolean = await this.postsService.deletePostId(
      req.params.id
    );
    if (!deletPost) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } 
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
}