import {body} from 'express-validator'

const allowedValues = ['Like', 'Dislike', 'None']

export const likeValidationRule = body('likeStatus')
    .isString().withMessage("It is string")
    .trim()
    .notEmpty().withMessage("It must be no empty")
    .matches(new RegExp(`^(${allowedValues.join('|')})$`)).withMessage("Pattern is incorrect")
