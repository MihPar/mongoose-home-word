import { Router } from "express";
import { postsController } from "../Compositions-root/posts-composition-root";
import { authorization } from "../middleware/authorizatin";
import { commentAuthorization } from "../middleware/commentAuthorization";
import { inputCommentValidator } from "../middleware/input-value-comment-middleware";
import { inputPostBlogValidator, inputPostContentValidator, inputPostShortDescriptionValidator, inputPostTitleValidator } from "../middleware/input-value-posts-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";


export const postsRouter = Router({});

postsRouter.get("/:postId/comments",commentAuthorization, postsController.getPostByPostId.bind(postsController));
postsRouter.post(
  "/:postId/comments",
  commentAuthorization,
  inputCommentValidator,
  ValueMiddleware,
  postsController.createCommentForPostByPostId.bind(postsController)
);
postsRouter.get("/", postsController.getPosts.bind(postsController));
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
postsRouter.get("/:id", commentAuthorization, postsController.getPostById.bind(postsController));
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
