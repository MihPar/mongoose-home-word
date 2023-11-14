import { DeviceModel, CollectionIP } from './../UIRepresentation/types/deviceAuthSession';
import dotenv from 'dotenv'
import { BlogsType } from '../UIRepresentation/types/blogsType';
import { PostsType } from '../UIRepresentation/types/postsType';
import { DBUserType } from '../UIRepresentation/types/usersType';
import { CommentType } from '../UIRepresentation/types/commentType';
import { MongoClient } from 'mongodb';
import { BlackList } from '../UIRepresentation/types/sessionTypes';
	 

dotenv.config()


const mongoURI = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'

export const client = new MongoClient(mongoURI)
export const db = client.db('dbMongoDb')
export async function runDb() {
	try {
		await client.connect()
		await db.command({ping: 1})
		console.log('Connect successfully to mongo server')
	} catch(e) {
		console.log('Cann`t to connect to db:', e)
		await client.close()
	}
}

export const stopDb = async () => {
	await client.close()
}

export const blogsCollection = db.collection<BlogsType>('blogs')
export const postsCollection = db.collection<PostsType>('posts')
export const userCollection = db.collection<DBUserType>('user')
export const commentCollection = db.collection<CommentType>('comment')
export const blackCollection = db.collection<BlackList>('session')
export const deviceAuthSessionCollection = db.collection<DeviceModel>('divice')
export const IPAuthSessionCollection = db.collection<CollectionIP>('IP')