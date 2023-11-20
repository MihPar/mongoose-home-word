import { paramsIdModel } from '../model/modePosts.ts/paramsIdModel';
import { bodyPostsModel } from '../model/modePosts.ts/bodyPostsMode';
import { bodyPostModelContent } from '../model/modePosts.ts/bodyPostModeContent';
import { postsRepositories } from '../DataAccessLayer/posts-db-repositories';
import { queryPostsModel } from '../model/modePosts.ts/queryPostsModel';
import { paramsPostIdMode } from '../model/modePosts.ts/paramsPostIdMode';
import {
  RequestWithParams,
  RequestWithBody,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  PaginationType,
} from "./types/types";
import {
  inputPostBlogValidator,
  inputPostContentValidator,
  inputPostShortDescriptionValidator,
  inputPostTitleValidator,
} from "../middleware/input-value-posts-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { authorization } from "../middleware/authorizatin";
import { Router, Response } from "express";
import { HTTP_STATUS } from "../utils";
import { postsService } from "../Bisnes-logic-layer/postsService";
import { commentService } from "../Bisnes-logic-layer/commentService";
import { CommentTypeView } from "./types/commentType";
import { commentRepositories } from "../DataAccessLayer/comment-db-repositories";
import { commentAuthorization } from "../middleware/commentAuthorization";
import { inputCommentValidator } from "../middleware/input-value-comment-middleware";
import { Posts } from './types/postsTypes';

export const postsRouter = Router({});

class RouterController {
	async getPostByPostId (
		req: RequestWithParamsAndQuery<paramsPostIdMode, queryPostsModel>,
		res: Response<PaginationType<CommentTypeView>>
	  ) {
		const { postId } = req.params;
		const {
		  pageNumber = "1",
		  pageSize = "10",
		  sortBy = "createdAt",
		  sortDirection = "desc",
		} = req.query;
		const isExistPots = await postsRepositories.findPostById(postId)
		if(!isExistPots) {
			return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
		}
		const commentByPostsId: PaginationType<CommentTypeView> | null = await commentRepositories.findCommentByPostId(
		  postId,
		  pageNumber,
		  pageSize,
		  sortBy,
		  sortDirection
		);
		if (!commentByPostsId) {
			return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		} else {
			   return res.status(HTTP_STATUS.OK_200).send(commentByPostsId);
		}
	  }
	  async createPostByPostId (
		req: RequestWithParamsAndBody<paramsPostIdMode, bodyPostModelContent>,
		res: Response<CommentTypeView>
	  ) {
		const { postId } = req.params;
		const { content } = req.body;
		const user = req.user;
		const post: Posts | null =
		  await postsRepositories.findPostById(postId);
	
		if (!post) return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		console.log(user)
		const createNewCommentByPostId: CommentTypeView| null =
		  await commentService.createNewCommentByPostId(postId, content, user._id.toString(), user.accountData.userName);
		if (!createNewCommentByPostId) {
			return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		} else {
			return res.status(HTTP_STATUS.CREATED_201).send(createNewCommentByPostId);
		}
	  }
	  async getPosts (
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
		  await postsRepositories.findAllPosts(
			pageNumber as string,
			pageSize as string,
			sortBy as string,
			sortDirection as string
		  );
		return res.status(HTTP_STATUS.OK_200).send(getAllPosts);
	  }
	  async createPost (
		req: RequestWithBody<bodyPostsModel>,
		res: Response<Posts>
	  ) {
		const { title, shortDescription, content, blogId } = req.body;
		const createNewPost: Posts | null = await postsService.createPost(
		  blogId,
		  title,
		  shortDescription,
		  content
		);
		if (!createNewPost) {
		  return res.sendStatus(HTTP_STATUS.BAD_REQUEST_400);
		} else {
		  return res.status(HTTP_STATUS.CREATED_201).send(createNewPost);
		}
	  }
	  async getPostById (
		req: RequestWithParams<paramsIdModel>,
		res: Response<Posts | null>
	  ) {
		const getPostById: Posts | null = await postsRepositories.findPostById(
		  req.params.id
		);
		if (!getPostById) {
		  return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		} else {
		  return res.status(HTTP_STATUS.OK_200).send(getPostById);
		}
	  }
	  async updatePostById (
		req: RequestWithParamsAndBody<paramsIdModel, bodyPostsModel>,
		res: Response<boolean>
	  ) {
		const { id } = req.params;
		const { title, shortDescription, content, blogId } = req.body;
		const updatePost: boolean = await postsService.updateOldPost(
		  id,
		  title,
		  shortDescription,
		  content,
		  blogId
		);
		if (!updatePost) {
		  return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		} else {
		  return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
		}
	  }
	  async deletePostById (req: RequestWithParams<paramsIdModel>, res: Response<void>) {
		const deletPost: boolean = await postsService.deletePostId(req.params.id);
		if (!deletPost) {
		  return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
		} else {
		  return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
		}
	  }
}

export const routerController = new RouterController()

postsRouter.get( "/:postId/comments", routerController.getPostByPostId);
postsRouter.post("/:postId/comments", commentAuthorization, inputCommentValidator, ValueMiddleware, routerController.createPostByPostId);
postsRouter.get("/", routerController.getPosts);
postsRouter.post("/", authorization, inputPostTitleValidator, inputPostShortDescriptionValidator, inputPostContentValidator, inputPostBlogValidator, ValueMiddleware, routerController.createPost);
postsRouter.get("/:id", routerController.getPostById);
postsRouter.put("/:id", authorization, inputPostTitleValidator, inputPostShortDescriptionValidator, inputPostContentValidator, inputPostBlogValidator, ValueMiddleware, routerController.updatePostById);
postsRouter.delete("/:id", authorization, routerController.deletePostById);
