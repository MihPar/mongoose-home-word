import { BlogsComtroller } from "../Controllers/blogs-controller";
import { BlogsRepositories } from "../Repositories/blogs-db-repositories";
import { PostsRepositories } from "../Repositories/posts-db-repositories";
import { BlogsService } from "../Service/blogsService";
import { PostsService } from "../Service/postsService";

const blogsRepositories = new BlogsRepositories();
export const blogsService = new BlogsService(blogsRepositories);
const postsRepositories = new PostsRepositories();
const postsService = new PostsService(postsRepositories);
export const blogsController = new BlogsComtroller(
  blogsService,
  blogsRepositories,
  postsService,
  postsRepositories
);