import { CommentRepositories } from './../Repositories/comment-db-repositories';
import { PostsController } from "../Controllers/posts-controller";
import { PostsRepositories } from "../Repositories/posts-db-repositories";
import { PostsService } from "../Service/postsService";
import { CommentService } from '../Service/commentService';
import { QueryPostsRepositories } from '../Repositories/queryRepositories/posts-query-repositories';
import { QueryCommentRepositories } from '../Repositories/queryRepositories/comment-query-repositories';
import { LikesRepositories } from '../Repositories/limit-db-repositories';
import { QueryUsersRepositories } from '../Repositories/queryRepositories/users-query-repositories';

export const queryCommentRepositories = new QueryCommentRepositories()
const queryUsersRepositories = new QueryUsersRepositories()
const queryPostsRepositories = new QueryPostsRepositories()
const postsRepositories = new PostsRepositories();

const commentRepositories = new CommentRepositories();
const likesRepositories = new LikesRepositories()
const commentService = new CommentService(commentRepositories, queryCommentRepositories, likesRepositories);
export const postsService = new PostsService(postsRepositories, queryUsersRepositories, queryPostsRepositories, queryCommentRepositories, commentService, likesRepositories);
export const postsController = new PostsController(
  postsRepositories,
  commentRepositories,
  queryCommentRepositories,
  commentService,
  postsService,
  queryPostsRepositories,
  queryUsersRepositories
);
