import { blackCollection } from './../db/db';
import { blogsService } from '../Bisnes-logic-layer/blogsService';
import { postsService } from '../Bisnes-logic-layer/postsService';
import { Router, Request, Response } from "express";
import { HTTP_STATUS } from "../utils";
import { userService } from '../Bisnes-logic-layer/userService';
import { IPAuthSessionCollection, commentCollection, deviceAuthSessionCollection} from '../db/db';

export const deleteAllRouter = Router({});

deleteAllRouter.delete(
  "/",
  async function (req: Request, res: Response<void>): Promise<Response<void>> {
    await postsService.deleteAllPosts();
    await blogsService.deleteAllBlogs();
	await userService.deleteAllUsers()
	await commentCollection.deleteMany({});
	await blackCollection.deleteMany({});
	await deviceAuthSessionCollection.deleteMany({});
	await IPAuthSessionCollection.deleteMany({});
    return res.sendStatus(HTTP_STATUS.NO_CONTENT_204);
  }
);
