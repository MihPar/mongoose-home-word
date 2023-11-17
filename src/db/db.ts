import { DeviceSchema, CollectioinIPSchema } from './../schema/deviceAuth-schema';
import { CommentSchema } from './../schema/comment-schema';
import { DBUserSchema } from './../schema/users-schema';
import { PostSchema } from './../schema/posts-schema';
import { BlogsSchema } from './../schema/blogs-schema';
import { DeviceModel, CollectionIP } from './../UI/types/deviceAuthSession';
import { BlogsType } from './../UI/types/blogsType';
import { PostsType } from './../UI/types/postsTypes';
import { DBUserType } from './../UI/types/userTypes';
import { BlackList } from './../UI/types/sessionTypes';
import { CommentType } from '../UI/types/commentType';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import { BlackListSchema } from '../schema/session-schema';
import mongoose from 'mongoose';
dotenv.config()
	 

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.MONGOOSE_DB_NAME || 'mongoose-example'



export const client = new MongoClient(mongoURI)
export const db = client.db('dbMongoDb')
export async function runDb() {
	try {
		
		await mongoose.connect(mongoURI)
		console.log('Connect successfully to mongo server')
	} catch(e) {
		console.log('Cann`t to connect to db:', e)
		await mongoose.disconnect()
	}
}

export const stopDb = async () => {
	await client.close()
}

export const BlogsModel = mongoose.model<BlogsType>('blogs', BlogsSchema)
export const PostsModel = mongoose.model<PostsType>('posts', PostSchema)
export const UsersModel = mongoose.model<DBUserType>('user', DBUserSchema)
export const CommentsModel = mongoose.model<CommentType>('comment', CommentSchema)
export const BlackListMode = mongoose.model<BlackList>('blackList', BlackListSchema)
export const DevicesModel =mongoose.model<DeviceModel>('device', DeviceSchema)
export const IPCollectionModel = mongoose.model<CollectionIP>('IP', CollectioinIPSchema)

// export const blogsCollection = db.collection<BlogsType>('blogs')
// export const postsCollection = db.collection<PostsType>('posts')
// export const userCollection = db.collection<DBUserType>('user')
// export const commentCollection = db.collection<CommentType>('comment')
// export const blackCollection = db.collection<BlackList>('blackList')
// export const deviceAuthSessionCollection = db.collection<DeviceModel>('device')
// export const IPAuthSessionCollection = db.collection<CollectionIP>('IP')