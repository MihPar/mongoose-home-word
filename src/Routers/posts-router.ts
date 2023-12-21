import { Router } from "express";
import { postsController } from "../Compositions-root/posts-composition-root";
import { authorization } from "../middleware/authorizatin";
import { commentAuthorization } from "../middleware/commentAuthorization";
import { inputCommentValidator } from "../middleware/input-value-comment-middleware";
import { inputPostBlogValidator, inputPostContentValidator, inputPostShortDescriptionValidator, inputPostTitleValidator } from "../middleware/input-value-posts-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { getCommentAuthorization } from "../middleware/getCommentsAuthorization";
import { likeValidationRule } from "../middleware/input-value-likeStatus-middleware";


export const postsRouter = Router({});


postsRouter.get("/:postId/comments",getCommentAuthorization, postsController.getCommentsByPostId.bind(postsController));
postsRouter.post(
  "/:postId/comments",
  commentAuthorization,
  inputCommentValidator,
  ValueMiddleware,
  postsController.createCommentForPostByPostId.bind(postsController)
);
postsRouter.get("/",getCommentAuthorization, postsController.getPosts.bind(postsController));
postsRouter.post(
  "/",
  authorization,
  inputPostTitleValidator,
  inputPostShortDescriptionValidator,
  inputPostContentValidator,
  inputPostBlogValidator,
  ValueMiddleware,
  postsController.createPost.bind(postsController)
);
postsRouter.get("/:id",getCommentAuthorization, postsController.getPostById.bind(postsController));

postsRouter.put("/:postId/like-status", commentAuthorization, likeValidationRule, ValueMiddleware, postsController.updateLikeStatus.bind(postsController));

postsRouter.put(
  "/:id",
  authorization,
  inputPostTitleValidator,
  inputPostShortDescriptionValidator,
  inputPostContentValidator,
  inputPostBlogValidator,
  ValueMiddleware,
  postsController.updatePostById.bind(postsController)
);




postsRouter.delete("/:id", authorization, postsController.deletePostById.bind(postsController));
