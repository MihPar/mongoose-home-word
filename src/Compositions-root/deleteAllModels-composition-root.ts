import { DeleteAllRouter } from "../Controllers/delete-all-users";
import { blogsService } from "./blogs-composition.root";
import { commentService } from "./comment-composition-root";
import { postsService } from "./posts-composition-root";
import { deviceService } from "./securityDevice-compostition-root";
import { userService } from "./user-composition-root";

export const deleteAll = new DeleteAllRouter(postsService, blogsService, userService, commentService, deviceService)