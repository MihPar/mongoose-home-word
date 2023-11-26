import { likeStatusModel } from "../model/modelComment/bodyLikeStatusMode";
import { paramsCommentMode } from "../model/modelComment/paramsCommentModel";
import { CommentRepositories } from "../Repositories/comment-db-repositories";
import { Router, Response } from "express";
import { CommentService } from "../Service/commentService";
import { HTTP_STATUS } from "../utils/utils";
import { RequestWithParams, RequestWithParamsAndBody } from "../types/types";
import { bodyCommentIdMode } from "../model/modelComment/boydCommentIdMode";
import { paramsCommentIdMode } from "../model/modelComment/paramsCommentIdModel copy";
import { CommentView } from "../types/commentType";
import { QueryCommentRepositories } from "../Repositories/queryRepositories/comment-query-repositories";


export class CommentController {
  constructor(
    protected commentRepositories: CommentRepositories,
    protected commentService: CommentService,
	protected queryCommentRepositories: QueryCommentRepositories
  ) {}
  async updateByCommentIdLikeStatus(
    req: RequestWithParamsAndBody<paramsCommentIdMode, likeStatusModel>,
    res: Response
  ) {
    const { commentId } = req.params;
    const { likeStatus } = req.body;
	const {userId} = req.user;
    const findCommentById = await this.queryCommentRepositories.findCommentByCommentId(
      commentId, userId
    );
    if (!findCommentById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
	await this.commentService.updateltLikeStatus(likeStatus, commentId, userId)
	return res.sendStatus(HTTP_STATUS.NO_CONTENT_204)
  }
  async updateByCommentId(
    req: RequestWithParamsAndBody<paramsCommentIdMode, bodyCommentIdMode>,
    res: Response<boolean>
  ) {
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
    res: Response<CommentView | null>
  ): Promise<Response<CommentView | null>> {
	const {userId} = req.user;
    const getCommentById: CommentView | null =
      await this.queryCommentRepositories.findCommentById(req.params.id, userId);
    if (!getCommentById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(getCommentById);
    }
  }
}