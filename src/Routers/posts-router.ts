import { postsController } from "../Compositions-root/posts-composition-root";
import { postsRouter } from "../Controllers/posts-controller";
import { authorization } from "../middleware/authorizatin";
import { commentAuthorization } from "../middleware/commentAuthorization";
import { inputCommentValidator } from "../middleware/input-value-comment-middleware";
import { inputPostBlogValidator, inputPostContentValidator, inputPostShortDescriptionValidator, inputPostTitleValidator } from "../middleware/input-value-posts-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";

postsRouter.get("/:postId/comments", postsController.getPostByPostId.bind(postsController.getPostByPostId));
postsRouter.post(
  "/:postId/comments",
  commentAuthorization,
  inputCommentValidator,
  ValueMiddleware,
  postsController.createPostByPostId.bind(postsController.createPostByPostId)
);
postsRouter.get("/", postsController.getPosts.bind(postsController.getPosts));
postsRouter.post(
  "/",
  authorization,
  inputPostTitleValidator,
  inputPostShortDescriptionValidator,
  inputPostContentValidator,
  inputPostBlogValidator,
  ValueMiddleware,
  postsController.createPost.bind(postsController.createPost)
);
postsRouter.get("/:id", postsController.getPostById.bind(postsController.getPostById));
postsRouter.put(
  "/:id",
  authorization,
  inputPostTitleValidator,
  inputPostShortDescriptionValidator,
  inputPostContentValidator,
  inputPostBlogValidator,
  ValueMiddleware,
  postsController.updatePostById.bind(postsController.updatePostById)
);
postsRouter.delete("/:id", authorization, postsController.deletePostById.bind(postsController.deletePostById));
