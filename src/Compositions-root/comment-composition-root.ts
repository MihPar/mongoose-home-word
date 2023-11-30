import { CommentController } from "../Controllers/comments-controller";
import { CommentRepositories } from "../Repositories/comment-db-repositories";
import { LikesRepositories } from "../Repositories/limit-db-repositories";
import { QueryCommentRepositories } from "../Repositories/queryRepositories/comment-query-repositories";
import { CommentService } from "../Service/commentService";

const queryCommentRepositories = new QueryCommentRepositories()
const commentRepositories = new CommentRepositories()
const likesRepositories = new LikesRepositories()
export const commentService = new CommentService(commentRepositories, queryCommentRepositories, likesRepositories)
export const commentController = new CommentController(commentRepositories, commentService, queryCommentRepositories)