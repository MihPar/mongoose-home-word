import { UserType, DBUserType } from './../UI/types/userTypes';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export const DBUserSchema = new mongoose.Schema<WithId<DBUserType>>({
	accountData: {
		userName: {type: String, require: true},
		email: {type: String, require: true},
		passwordHash: {type: String, require: true},
		createdAt: {type: String, require: true}
	},
    emailConfirmation: {
		confirmationCode: {type: String, require: false},
		expirationDate: {type: Date, require: false},
		isConfirmed: {type: Boolean, require: false}
	},
})

export const UsersType = new mongoose.Schema<WithId<UserType>>({
	login: {type: String, require: true},
	email: {type: String, require: true},
	createdAt: {type: String, require: true}
})