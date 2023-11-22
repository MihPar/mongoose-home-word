import { userService } from './../Bisnes-logic-layer/userService';
import { blogsService } from './../Service/blogsService';
import { postsService } from './../Bisnes-logic-layer/postsService';
import { CommentsModel, DevicesModel, IPCollectionModel } from '../db/db';
import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../utils";

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
