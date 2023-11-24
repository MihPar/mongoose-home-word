import { Router } from "express";
import { commentController } from "../Compositions-root/comment-composition-root";
import { commentAuthorization } from "../middleware/commentAuthorization";
import { inputCommentValidator } from "../middleware/input-value-comment-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";

export const commentsRouter = Router({});

commentsRouter.put('/:commentId/like-status', commentAuthorization, commentController.updateByCommentIdLikeStatus.bind(commentController))

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
  
  commentsRouter.get("/:id", commentController.getCommentById.bind(commentController));
