import { Blogs, BlogsDB } from '../types/blogsType';
import mongoose from 'mongoose'
import { WithId } from 'mongodb'

export const BlogsSchema = new mongoose.Schema<WithId<BlogsDB>>({
	name: {type: String, require: true},
	description: {type: String, require: true},
	websiteUrl: {type: String, require: true},
	createdAt: {type: String, require: true},
	isMembership: {type: Boolean, require: true},
})