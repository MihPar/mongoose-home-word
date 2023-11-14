import { body } from "express-validator"

export const inputCommentValidator = body('content')
.isString()
.trim()
.notEmpty()
.isLength({min: 20, max: 300})
.withMessage('Content should be lenght from 20 to 300 symbols')