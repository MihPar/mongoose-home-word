import { commentController } from "../Compositions-root/comment-composition-root";
import { commentsRouter } from "../Controllers/comments-controller";
import { commentAuthorization } from "../middleware/commentAuthorization";
import { inputCommentValidator } from "../middleware/input-value-comment-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";

commentsRouter.put('/:commentId/like-status', commentAuthorization, commentController.updateByCommentIdLikeStatus.bind(commentController.updateByCommentIdLikeStatus))

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