import { LikesInfo } from './../types/likesInfoType';
import { DeviceSchema, CollectioInIPSchema } from './../schema/deviceAuth-schema';
import { CommentSchema } from './../schema/comment-schema';
import { DBUserSchema } from './../schema/users-schema';
import { PostSchema } from './../schema/posts-schema';
import { BlogsSchema } from './../schema/blogs-schema';
import { Blogs} from '../types/blogsType';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { Users } from '../types/userTypes';
import { Posts } from '../types/postsTypes';
import { CollectionIP, Devices } from '../types/deviceAuthSessionTypes';
import { Comments } from '../types/commentType';
import { LikesInfoSchema } from '../schema/likesInfo-schema';
dotenv.config()
	 

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.MONGOOSE_DB_NAME || 'mongoose-example'



export const client = new MongoClient(mongoURI)
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

export const BlogsModel = mongoose.model<Blogs>('blogs', BlogsSchema)
export const PostsModel = mongoose.model<Posts>('posts', PostSchema)
export const UsersModel = mongoose.model<Users>('user', DBUserSchema)
export const CommentsModel = mongoose.model<Comments>('comment', CommentSchema)
export const DevicesModel = mongoose.model<Devices>('device', DeviceSchema)
export const IPCollectionModel = mongoose.model<CollectionIP>('IP', CollectioInIPSchema)
export const LikesModel = mongoose.model<LikesInfo>('like-dislike', LikesInfoSchema)

// export const blogsCollection = db.collection<BlogsType>('blogs')
// export const postsCollection = db.collection<PostsType>('posts')
// export const userCollection = db.collection<DBUserType>('user')
// export const commentCollection = db.collection<CommentType>('comment')
// export const blackCollection = db.collection<BlackList>('blackList')
// export const deviceAuthSessionCollection = db.collection<DeviceModel>('device')
// export const IPAuthSessionCollection = db.collection<CollectionIP>('IP')