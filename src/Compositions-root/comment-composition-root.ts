import { CommentController } from "../Controllers/comments-controller";
import { CommentRepositories } from "../Repositories/comment-db-repositories";
import { CommentService } from "../Service/commentService";

const commentRepositories = new CommentRepositories()
const commentService = new CommentService(commentRepositories)
export const commentController = new CommentController(commentRepositories, commentService)