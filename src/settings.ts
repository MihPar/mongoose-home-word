import { securityDeviceRouter } from './UIRepresentation/securityDevice';
import { usersRouter } from './UIRepresentation/user-router';
import express from 'express'
import { blogsRouter } from './UIRepresentation/blogs-router'
import { postsRouter } from './UIRepresentation/posts-router'
import { deleteAllRouter } from './UIRepresentation/deleteAll-router'
import { authRouter} from './UIRepresentation/auth-router'
import { commentsRouter } from './UIRepresentation/comments-router';
import cookieParser from 'cookie-parser'


	export const app = express()

	app.use(express.json());
	app.use(cookieParser())

	app.use('/posts', postsRouter)
	app.use('/blogs',  blogsRouter)
	app.use('/testing/all-data', deleteAllRouter)
	app.use('/auth', authRouter)
	app.use('/users', usersRouter)
	app.use('/comments', commentsRouter)
	app.use('/security/devices', securityDeviceRouter)

	app.get('/test', (req, res) => {
		res.json({ message: 'This is a test endpoint!' });
	});
