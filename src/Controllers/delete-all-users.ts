import { Request, Response } from "express";
import { HTTP_STATUS } from "../utils/utils";
import { postsService } from '../Compositions-root/posts-composition-root';
import { blogsService } from '../Compositions-root/blogs-composition.root';
import { userService } from '../Compositions-root/user-composition-root';
import { UserService } from '../Service/userService';
import { BlogsService } from '../Service/blogsService';
import { PostsService } from '../Service/postsService';
import { deviceService } from '../Compositions-root/securityDevice-compostition-root';
import { IPCollectionModel } from "../db/db";
import { DeviceService } from "../Service/deviceService";
import { CommentService } from "../Service/commentService";
import { commentService } from "../Compositions-root/comment-composition-root";


export class DeleteAllRouter {
	constructor(
		protected postsService: PostsService,
		protected blogsService: BlogsService,
		protected userService: UserService,
		protected commentService: CommentService,
		protected deviceService: DeviceService
	) {}
	async deleteAllModels (req: Request, res: Response<void>): Promise<Response<void>> {
		await postsService.deleteAllPosts();
		await blogsService.deleteAllBlogs();
		await userService.deleteAllUsers()
		await commentService.deleteAllComments()
		await deviceService.deleteAllDevices()
		await IPCollectionModel.deleteMany({});
		return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
	  }
}

