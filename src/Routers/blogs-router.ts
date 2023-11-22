import { blogsController } from "../Compositions-root/blogs-composition.root";
import { blogsRouter } from "../Controllers/blogs-controller";
import { authorization } from "../middleware/authorizatin";
import { inputBlogDescription, inputBlogNameValidator, inputBlogWebsiteUrl } from "../middleware/input-value-blogs-middleware";
import { ValueMiddleware } from "../middleware/validatorMiddleware";
import { inputPostContentValidator, inputPostShortDescriptionValidator, inputPostTitleValidator } from '../middleware/input-value-posts-middleware';

blogsRouter.get("/", blogsController.getBlogs.bind(blogsController.getBlogs));
blogsRouter.post(
  "/",
  authorization,
  inputBlogNameValidator,
  inputBlogDescription,
  inputBlogWebsiteUrl,
  ValueMiddleware,
  blogsController.createBlog.bind(blogsController.createBlog)
);
blogsRouter.get("/:blogId/posts", blogsController.getBlogsByPostIdPost.bind(blogsController.getBlogsByPostIdPost));
blogsRouter.post(
  "/:blogId/posts",
  authorization,
  inputPostContentValidator,
  inputPostTitleValidator,
  inputPostShortDescriptionValidator,
  ValueMiddleware,
  blogsController.createBlogsByBlogsIdPost.bind(blogsController.createBlogsByBlogsIdPost)
);
blogsRouter.get("/:id", blogsController.getPostById.bind(blogsController.getPostById));
blogsRouter.put(
  "/:id",
  authorization,
  inputBlogNameValidator,
  inputBlogDescription,
  inputBlogWebsiteUrl,
  ValueMiddleware,
  blogsController.updateBlogsById.bind(blogsController.updateBlogsById)
);
blogsRouter.delete("/:id", authorization, blogsController.deleteBlogsById.bind(blogsController.deleteBlogsById));
