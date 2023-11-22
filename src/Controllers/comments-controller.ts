import { likeStatusModel } from "../model/modelComment/bodyLikeStatusMode";
import { paramsCommentMode } from "../model/modelComment/paramsCommentModel";
import { CommentRepositories } from "../Repositories/comment-db-repositories";
import { commentAuthorization } from "../middleware/commentAuthorization";
import { Router, Response } from "express";
import { inputCommentValidator } from "../middleware/input-value-comment-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { CommentService } from "../Service/commentService";
import { HTTP_STATUS } from "../utils";
import { RequestWithParams, RequestWithParamsAndBody } from "../types/types";
import { bodyCommentIdMode } from "../model/modelComment/boydCommentIdMode";
import { paramsCommentIdMode } from "../model/modelComment/paramsCommentIdModel copy";
import { CommentView } from "../types/commentType";

export const commentsRouter = Router({});

class CommentController {
	commentRepositories: CommentRepositories
	commentService: CommentService
	constructor() {
		this.commentRepositories = new CommentRepositories()
		this.commentService = new CommentService()
	}
  async updateByCommentIdLikeStatus(
    req: RequestWithParamsAndBody<paramsCommentIdMode, likeStatusModel>,
    res: Response
  ) {
    const { commentId } = req.params;
    const { likeStatus } = req.body;
	const findCommentById = await this.commentRepositories.findCommentById(commentId)
	if(!findCommentById) {
		return res.sendStatus(HTTP_STATUS.NOT_FOUND_404)
	}
  }
  async updateByCommentId(
    req: RequestWithParamsAndBody<paramsCommentIdMode, bodyCommentIdMode>,
    res: Response<boolean>
  ) {
    const { commentId } = req.params;
    const { content } = req.body;
    const isExistComment = await this.commentRepositories.findCommentById(commentId);
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
    const isExistComment = await this.commentRepositories.findCommentById(commentId);
    if (!isExistComment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    if (req.user._id.toString() !== isExistComment.commentatorInfo.userId) {
      return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
    }
    const deleteCommentById: boolean = await this.commentRepositories.deleteComment(
      req.params.commentId
    );
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
    const getCommentById: CommentView | null =
      await this.commentRepositories.findCommentById(req.params.id);
    if (!getCommentById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(getCommentById);
    }
  }
}

export const commentController = new CommentController();

commentsRouter.put(
  "/:commentId",
  commentAuthorization,
  inputCommentValidator,
  ValueMiddleware,
  commentController.updateByCommentId.bind(commentController.updateByCommentId)
);

commentsRouter.delete(
  "/:commentId",
  commentAuthorization,
  commentController.deleteByCommentId.bind(commentController.deleteByCommentId)
);

commentsRouter.get("/:id", commentController.getCommentById);