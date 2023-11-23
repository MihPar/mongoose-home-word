import { body } from "express-validator";
import { queryBlogsRepositories } from "../Compositions-root/blogs-composition.root";

export const inputPostTitleValidator = body("title")
  .isString()
  .notEmpty()
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("Name should be length from 1 to 30 symbols");

export const inputPostShortDescriptionValidator = body("shortDescription")
  .isString()
  .notEmpty()
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("Descriptionme should be length from 1 to 100 symbols");

export const inputPostContentValidator = body("content")
  .isString()
  .notEmpty()
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("Descriptionme should be length from 1 to 1000 symbols");

export const inputPostBlogValidator = body("blogId")
  .isString()
  .trim()
  .notEmpty()
  .custom(async (id) => {
    const blogExist = await queryBlogsRepositories.findBlogById(id);
    if (!blogExist) {
      throw new Error("Blog is not exists");
    }
    return true;
  })
  .withMessage("Invalid blogId");
