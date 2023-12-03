import { commentDBToView } from './../utils/helpers';
import { likeStatusModel } from "../model/modelComment/bodyLikeStatusMode";
import { paramsCommentMode } from "../model/modelComment/paramsCommentModel";
import { CommentRepositories } from "../Repositories/comment-db-repositories";
import { Response } from "express";
import { CommentService } from "../Service/commentService";
import { HTTP_STATUS } from "../utils/utils";
import { RequestWithParams, RequestWithParamsAndBody } from "../types/types";
import { bodyCommentIdMode } from "../model/modelComment/boydCommentIdMode";
import { paramsCommentIdMode } from "../model/modelComment/paramsCommentIdModel copy";
import { QueryCommentRepositories } from "../Repositories/queryRepositories/comment-query-repositories";
import { CommentViewModel, CommentsDB } from "../types/commentType";


export class CommentController {
  constructor(
    protected commentRepositories: CommentRepositories,
    protected commentService: CommentService,
	protected queryCommentRepositories: QueryCommentRepositories
  ) {}

  async updateByCommentIdLikeStatus(
    req: RequestWithParamsAndBody<paramsCommentIdMode, likeStatusModel>,
    res: Response<boolean>
  ): Promise<Response<boolean>> {
    const { commentId } = req.params;
	// console.log("commentId: ", commentId)

    const { likeStatus } = req.body;
	// console.log("likeStatus: ", req.body.likeStatus)

	const userId = req.user.id;
	// console.log("userId: ", req.user.id)
	
    const findCommentById:  CommentsDB | null = await this.queryCommentRepositories.findCommentByCommentId(
      commentId
    );
	if (!findCommentById) {
		return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
	  }
	const findLike = await this.queryCommentRepositories.findLikeCommentByUser(commentId, userId)
	const commentDBBiew = commentDBToView(findCommentById, findLike?.myStatus ?? null)
	// console.log("findCommentById: ", findCommentById)
    
	let updateLikeStatus = await this.commentService.updateltLikeStatus(likeStatus, commentId, userId)
	// console.log(updateLikeStatus)
	return res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
  }

  async updateByCommentId(
    req: RequestWithParamsAndBody<paramsCommentIdMode, bodyCommentIdMode>,
    res: Response<boolean>
  ): Promise<Response<boolean>> {
    const { commentId } = req.params;
    const { content } = req.body;
	const {userId} = req.user;
    const isExistComment = await this.queryCommentRepositories.findCommentById(
      commentId, userId
    );
    if (!isExistComment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    if (req.user._id.toString() !== isExistComment.commentatorInfo.userId) {
      return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
    }
    const updateComment: boolean =
      await this.commentService.updateCommentByCommentId(commentId, content);

    if (!updateComment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
  async deleteByCommentId(
    req: RequestWithParams<paramsCommentIdMode>,
    res: Response<boolean>
  ): Promise<Response<boolean>> {
    const { commentId } = req.params;
	const {userId} = req.user;
    const isExistComment = await this.queryCommentRepositories.findCommentById(
      commentId, userId
    );
    if (!isExistComment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    if (req.user._id.toString() !== isExistComment.commentatorInfo.userId) {
      return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
    }
    const deleteCommentById: boolean =
      await this.commentRepositories.deleteComment(req.params.commentId);
    if (!deleteCommentById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
  async getCommentById(
    req: RequestWithParams<paramsCommentMode>,
    res: Response<CommentViewModel | null>
  ): Promise<Response<CommentViewModel | null>> {
	console.log("Req.user: ", req.user)
	const userId = req.user?.id ?? null;
	console.log("userId; ",userId)
    const getCommentById: CommentViewModel | null =
      await this.queryCommentRepositories.findCommentById(req.params.id, userId);
	//   console.log("getCommentById: ", getCommentById)
    if (!getCommentById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(getCommentById);
    }
  }
}