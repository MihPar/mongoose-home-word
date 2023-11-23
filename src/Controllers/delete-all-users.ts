import { CommentsModel, DevicesModel, IPCollectionModel } from '../db/db';
import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../utils/utils";
import { postsService } from '../Compositions-root/posts-composition-root';
import { blogsService } from '../Compositions-root/blogs-composition.root';
import { userService } from '../Compositions-root/user-composition-root';

export const deleteAllRouter = Router({});

deleteAllRouter.delete(
  "/",
  async function (req: Request, res: Response<void>): Promise<Response<void>> {
    await postsService.deleteAllPosts();
    await blogsService.deleteAllBlogs();
	await userService.deleteAllUsers()
	await CommentsModel.deleteMany({});
	await DevicesModel.deleteMany({});
	await IPCollectionModel.deleteMany({});
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
