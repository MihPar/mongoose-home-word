import { paramsCommentMode } from "../model/modelComment/paramsCommentModel";
import { CommentTypeView } from "./types/commentType";
import { commentRepositories } from "../DataAccessLayer/comment-db-repositories";
import { commentAuthorization } from "../middleware/commentAuthorization";
import { Router, Response } from "express";
import { inputCommentValidator } from "../middleware/input-value-comment-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { commentService } from "../Bisnes-logic-layer/commentService";
import { HTTP_STATUS } from "../utils";
import { RequestWithParams, RequestWithParamsAndBody } from "./types/types";
import { bodyCommentIdMode } from "../model/modelComment/boydCommentIdMode";
import { paramsCommentIdMode } from "../model/modelComment/paramsCommentIdModel copy";

export const commentsRouter = Router({});

commentsRouter.put(
  "/:commentId",
  commentAuthorization,
  inputCommentValidator,
  ValueMiddleware,
  async function (
    req: RequestWithParamsAndBody<paramsCommentIdMode, bodyCommentIdMode>,
    res: Response<boolean>
  ) {
    const { commentId } = req.params;
    const { content } = req.body;
    const isExistComment = await commentRepositories.findCommentById(commentId);
    if (!isExistComment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    if (req.user._id.toString() !== isExistComment.commentatorInfo.userId) {
      return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
    }
    const updateComment: boolean =
      await commentService.updateCommentByCommentId(commentId, content);

    if (!updateComment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);

commentsRouter.delete(
  "/:commentId",
  commentAuthorization,
  async function (
    req: RequestWithParams<paramsCommentIdMode>,
    res: Response<boolean>
  ): Promise<Response<boolean>> {
    const { commentId } = req.params;
    const isExistComment = await commentRepositories.findCommentById(commentId);
    if (!isExistComment) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    }
    if (req.user._id.toString() !== isExistComment.commentatorInfo.userId) {
      return res.sendStatus(HTTP_STATUS.FORBIDEN_403);
    }
    const deleteCommentById: boolean = await commentRepositories.deleteComment(
      req.params.commentId
    );
    if (!deleteCommentById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
    }
  }
);

commentsRouter.get(
  "/:id",
  async function (
    req: RequestWithParams<paramsCommentMode>,
    res: Response<CommentTypeView | null>
  ): Promise<Response<CommentTypeView | null>> {
    const getCommentById: CommentTypeView | null =
      await commentRepositories.findCommentById(req.params.id);
    if (!getCommentById) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND_404);
    } else {
      return res.status(HTTP_STATUS.OK_200).send(getCommentById);
    }
  }
);
