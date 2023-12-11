import { QueryBlogsRepositories } from './../Repositories/queryRepositories/blogs-query-repositories';
import { BlogsComtroller } from "../Controllers/blogs-controller";
import { BlogsRepositories } from "../Repositories/blogs-db-repositories";
import { PostsRepositories } from "../Repositories/posts-db-repositories";
import { BlogsService } from "../Service/blogsService";
import { PostsService } from "../Service/postsService";
import { QueryPostsRepositories } from '../Repositories/queryRepositories/posts-query-repositories';
import { queryUsersRepositories } from './user-composition-root';
import { queryCommentRepositories } from './posts-composition-root';
import { commentService } from './comment-composition-root';
import { LikesRepositories } from '../Repositories/limit-db-repositories';

const queryPostsRepositories = new QueryPostsRepositories()
const likesRepositories = new LikesRepositories()
export const queryBlogsRepositories = new QueryBlogsRepositories()
const blogsRepositories = new BlogsRepositories();
export const blogsService = new BlogsService(blogsRepositories);
const postsRepositories = new PostsRepositories();
const postsService = new PostsService(postsRepositories, queryUsersRepositories, queryPostsRepositories, queryCommentRepositories, commentService, likesRepositories);
export const blogsController = new BlogsComtroller(
  blogsService,
  blogsRepositories,
  postsService,
  postsRepositories,
  queryBlogsRepositories,
  queryPostsRepositories
);