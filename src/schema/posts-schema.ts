import { Posts } from './../UI/types/postsTypes';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export const PostSchema = new mongoose.Schema<WithId<Posts>>({
	title: {type: String, require: true},
	shortDescription: {type: String, require: true},
	content: {type: String, require: true},
	blogId: {type: String, require: true},
	blogName: {type: String, require: true},
	createdAt: {type: String, require: true}
})