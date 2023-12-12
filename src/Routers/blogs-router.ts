import { blogsController } from "../Compositions-root/blogs-composition.root";
import { authorization } from "../middleware/authorizatin";
import { inputBlogDescription, inputBlogNameValidator, inputBlogWebsiteUrl } from "../middleware/input-value-blogs-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { inputPostContentValidator, inputPostShortDescriptionValidator, inputPostTitleValidator } from '../middleware/input-value-posts-middleware';
import { Router } from "express";
import { getCommentAuthorization } from "../middleware/getCommentsAuthorization";

export const blogsRouter = Router({});

blogsRouter.get("/", blogsController.getBlogs.bind(blogsController));
blogsRouter.post(
  "/",
  authorization,
  inputBlogNameValidator,
  inputBlogDescription,
  inputBlogWebsiteUrl,
  ValueMiddleware,
  blogsController.createBlog.bind(blogsController)
);
blogsRouter.get("/:blogId/posts",getCommentAuthorization, blogsController.getBlogsByPostIdPost.bind(blogsController));
blogsRouter.post(
  "/:blogId/posts",
  authorization,
  inputPostContentValidator,
  inputPostTitleValidator,
  inputPostShortDescriptionValidator,
  ValueMiddleware,
  blogsController.createBlogsByBlogsIdPost.bind(blogsController)
);
blogsRouter.get("/:id", blogsController.getPostById.bind(blogsController));
blogsRouter.put(
  "/:id",
  authorization,
  inputBlogNameValidator,
  inputBlogDescription,
  inputBlogWebsiteUrl,
  ValueMiddleware,
  blogsController.updateBlogsById.bind(blogsController)
);
blogsRouter.delete("/:id", authorization, blogsController.deleteBlogsById.bind(blogsController));
