import { CommentRepositories } from './../Repositories/comment-db-repositories';
import { PostsController } from "../Controllers/posts-controller";
import { PostsRepositories } from "../Repositories/posts-db-repositories";
import { PostsService } from "../Service/postsService";
import { CommentService } from '../Service/commentService';
import { QueryPostsRepositories } from '../Repositories/queryRepositories/posts-query-repositories';
import { QueryCommentRepositories } from '../Repositories/queryRepositories/comment-query-repositories';

const queryCommentRepositories = new QueryCommentRepositories()
const queryPostsRepositories = new QueryPostsRepositories()
const postsRepositories = new PostsRepositories();
export const postsService = new PostsService(postsRepositories);
const commentRepositories = new CommentRepositories();
const commentService = new CommentService(commentRepositories);
export const postsController = new PostsController(
  postsRepositories,
  commentRepositories,
  queryCommentRepositories,
  commentService,
  postsService,
  queryPostsRepositories,
);