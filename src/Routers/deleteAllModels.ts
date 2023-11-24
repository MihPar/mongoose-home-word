import { DeleteAllRouter } from './../Controllers/delete-all-users';
import { Router } from "express";
import { deleteAll } from "../Compositions-root/deleteAllModels-composition-root";

export const deleteAllRouter = Router({});

deleteAllRouter.delete("/", deleteAll.deleteAllModels.bind(deleteAll));
  