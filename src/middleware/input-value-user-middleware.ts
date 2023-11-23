import { queryUsersRepositories } from '../Compositions-root/user-composition-root';
import { Users } from '../types/userTypes';
import {body} from 'express-validator'

export const inputValueUserEmailValidatioin = body('email')
.isString()
.trim()
.isEmail()
.custom(async(email): Promise<boolean> => {
	const user: Users | null = await queryUsersRepositories.findByLoginOrEmail(email)
	if(user) {
		throw new Error('User does not exist in DB')
	} 
	return true
})
.withMessage('Email incorrect')

export const inputValueLoginValidation = body('login')
.isString()
.notEmpty()
.trim()
.isLength({min: 3, max: 10})
.matches(/^[a-zA-Z0-9_-]/)
.withMessage('login should be length from 3 to 10 symbols')

export const inputValuePasswordValidation = body('password')
.isString()
.notEmpty()
.trim()
.isLength({min: 6, max: 20})
.withMessage('password should be length from 6 to 20 symbols')