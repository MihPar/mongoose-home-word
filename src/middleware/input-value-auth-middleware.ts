import { Users } from '../types/userTypes';
import { body } from 'express-validator';
import { queryUsersRepositories } from '../Compositions-root/user-composition-root';

export const inputValueLoginAuth = body('login')
.isString()
.notEmpty()
.trim()
.isLength({min: 3, max: 10})
.matches(/^[a-zA-Z0-9_-]/)
.custom(async(login) => {
		const user: Users | null = await queryUsersRepositories.findByLoginOrEmail(login)
		if(user) {
			throw new Error('Login does not exist in DB')
		}
		return true
})

export const inputValuePasswordAuth = body('password')
.isString()
.notEmpty()
.trim()
.isLength({min: 6, max: 20})
.withMessage('password should be length from 6 to 20 symbols')

export const inputValueNewPasswordAuth = body('newPassword')
.isString()
.notEmpty()
.trim()
.isLength({min: 6, max: 20})
.withMessage('new password should be length from 6 to 20 symbols')


export const inputValueEmailRegistrationAuth = body('email')
.isString()
.trim()
.isEmail()
.custom(async(email) => {
	const user: Users | null = await queryUsersRepositories.findByLoginOrEmail(email)
	if(user) {
		throw new Error('Email does not exist in DB')
	} 
	return true
})


export const inputValueEmailAuth = body('email')
.isString()
.trim()
.isEmail()
.custom(async(email, {req}): Promise<boolean> => {
	const user: Users | null = await queryUsersRepositories.findByLoginOrEmail(email)
	if(!user) {
		throw new Error('User does not exist in DB')
	} else if(user.emailConfirmation.isConfirmed === true) {
		throw new Error('Email is already exist in DB')
	}
	req.user = user?._id.toHexString()
	return true
})

export const inputValueEmailAuthPasswordRecovery = body('email')
.isString()
.trim()
.isEmail()
.notEmpty()
.isLength({min: 6, max: 30})
.withMessage('value of email is incorrect')
// .custom(async(email, {req}): Promise<boolean> => {
// 	const user: DBUserType | null = await userRepositories.findByLoginOrEmail(email)
// 	if(!user) {
// 		throw new Error('User does not exist in DB')
// 	} else if(user.emailConfirmation.isConfirmed === true) {
// 		throw new Error('Email is already exist in DB')
// 	}
// 	req.user = user?._id.toHexString()
// 	return true
// })

export const inputValueLoginOrEamilAuth = body('loginOrEmail')
.isString()
.notEmpty()
.trim()
.withMessage('loginOrEmail is not string')

export const inputValueCodeAuth = body('code')
.isString()
.withMessage('Code should be string')
.notEmpty()
.trim()
.custom(async(code, {req}) => {
	console.log(code)
	const user: Users | null = await queryUsersRepositories.findUserByConfirmation(code)
	console.log(user)
	if(!user) {
		throw new Error('User not found')
	} 
    if(user.emailConfirmation.expirationDate <= new Date()) {
		throw new Error('code was expiration')
	} 
	if(user.emailConfirmation.isConfirmed) {
		throw new Error('Code is alreade confirmed')
	}
	req.user = user
	return true
})

export const inputValueRecoveryCodeAuth = body('recoveryCode')
.isString()
.notEmpty()
.trim()
.withMessage('recovery code is incorrect')
// https://somesite.com/confirm-email?code=ad8d1ff0-ed7d-43d2-b595-251b8de56d3d
// .custom(async(code, {req}) => {
// 	console.log(code)
// 	const user: DBUserType | null = await userRepositories.findUserByConfirmation(code)
// 	console.log(user)
// 	if(!user) {
// 		throw new Error('User not found')
// 	} 
//     if(user.emailConfirmation.expirationDate <= new Date()) {
// 		throw new Error('code was expiration')
// 	} 
// 	if(user.emailConfirmation.isConfirmed) {
// 		throw new Error('Code is alreade confirmed')
// 	}
// 	req.user = user
// 	return true
// })