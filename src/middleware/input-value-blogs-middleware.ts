import {body} from 'express-validator'

export const inputBlogNameValidator = body('name')
.isString()
.notEmpty()
.trim()
.isLength({min: 1, max: 15})
.withMessage('Name should be length from 1 to 15 symbols')

export const inputBlogDescription = body('description')
.isString()
.notEmpty()
.trim()
.isLength({min: 1, max: 500})
.withMessage('Descriptionme should be length from 1 to 500 symbols')

export const inputBlogWebsiteUrl = body('websiteUrl')
.isString()
.isURL()
.trim()
.notEmpty()
.isLength({min: 1, max: 100})
.withMessage('Descriptionme should be length from 1 to 100 symbols')