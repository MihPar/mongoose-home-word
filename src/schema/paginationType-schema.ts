import { Users } from './../UI/types/userTypes';
import { PaginationType } from './../UI/types/types';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'


export const PaginationTypeSchema = new mongoose.Schema<WithId<PaginationType<Users>>>({
	pagesCount: {type: Number, require: true},
	page: {type: Number, require: true},
	pageSize: {type: Number, require: true},
	totalCount: {type: Number, require: true},
	items: {
		login: {type: String, require: true},
		email: {type: String, require: true},
		createdAt: {type: String, require: true},
	}
})