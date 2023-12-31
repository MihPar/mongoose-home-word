import { Like } from './../types/likesInfoType';
import { DeviceSchema, CollectioInIPSchema } from './../schema/deviceAuth-schema';
import { CommentSchema } from './../schema/comment-schema';
import { DBUserSchema } from './../schema/users-schema';
import { PostSchema } from './../schema/posts-schema';
import { BlogsSchema } from './../schema/blogs-schema';
import { BlogsDB} from '../types/blogsType';
import dotenv from 'dotenv'
import mongoose from 'mongoose';
import { Users } from '../types/userTypes';
import { PostsDB } from '../types/postsTypes';
import { CollectionIP, Devices } from '../types/deviceAuthSessionTypes';
import { LikesInfoSchema } from '../schema/likesInfo-schema';
import { CommentsDB } from '../types/commentType';
dotenv.config()
	 

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.MONGOOSE_DB_NAME || 'mongoose-example'



// export const client = new MongoClient(mongoURI)
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
	await mongoose.connection.close()
}

export const BlogsModel = mongoose.model<BlogsDB>('blogs', BlogsSchema)
export const PostsModel = mongoose.model<PostsDB>('posts', PostSchema)
export const UsersModel = mongoose.model<Users>('user', DBUserSchema)
export const CommentsModel = mongoose.model<CommentsDB>('comment', CommentSchema)
export const DevicesModel = mongoose.model<Devices>('device', DeviceSchema)
export const IPCollectionModel = mongoose.model<CollectionIP>('IP', CollectioInIPSchema)
export const LikesModel = mongoose.model<Like>('like-dislike', LikesInfoSchema)

// export const blogsCollection = db.collection<BlogsType>('blogs')
// export const postsCollection = db.collection<PostsType>('posts')
// export const userCollection = db.collection<DBUserType>('user')
// export const commentCollection = db.collection<CommentType>('comment')
// export const blackCollection = db.collection<BlackList>('blackList')
// export const deviceAuthSessionCollection = db.collection<DeviceModel>('device')
// export const IPAuthSessionCollection = db.collection<CollectionIP>('IP')