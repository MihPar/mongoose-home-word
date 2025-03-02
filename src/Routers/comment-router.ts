import { Router } from "express";
import { commentController } from "../Compositions-root/comment-composition-root";
import { commentAuthorization } from "../middleware/commentAuthorization";
import { inputCommentValidator } from "../middleware/input-value-comment-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { getCommentAuthorization } from "../middleware/getCommentsAuthorization";
import { likeValidationRule } from "../middleware/input-value-likeStatus-middleware";

export const commentsRouter = Router({});

commentsRouter.put(
  "/:commentId/like-status",
  commentAuthorization,
  likeValidationRule,
  ValueMiddleware,
  commentController.updateByCommentIdLikeStatus.bind(commentController)
);

commentsRouter.put(
  "/:commentId",
  commentAuthorization,
  inputCommentValidator,
  ValueMiddleware,
  commentController.updateByCommentId.bind(commentController)
);
  
  commentsRouter.delete(
	"/:commentId",
	commentAuthorization,
	commentController.deleteByCommentId.bind(commentController)
  );
  
  commentsRouter.get("/:id", getCommentAuthorization, commentController.getCommentById.bind(commentController));
