import { BlackList } from './../UI/types/sessionTypes';
import { BlogsType } from './../UI/types/blogsType';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export const BlackListSchema = new mongoose.Schema<WithId<BlackList>>({
	refreshToken: {type: String, require: true}
})