import { PostsDB } from '../types/postsTypes';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'
import { LikesInfoSchema } from './likesInfo-schema';

export const PostSchema = new mongoose.Schema<WithId<PostsDB>>({
	title: {type: String, require: true},
	shortDescription: {type: String, require: true},
	content: {type: String, require: true},
	blogId: {type: String, require: true},
	blogName: {type: String, require: true},
	createdAt: {type: String, require: true},
	likes: {type: [LikesInfoSchema], default: []}
})