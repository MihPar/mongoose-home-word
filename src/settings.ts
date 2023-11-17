import { securityDeviceRouter } from './UI/security-device';
import { commentsRouter } from './UI/comments-router';
import { usersRouter } from './UI/users-router';
import { authRouter } from './UI/auth-router';
import { blogsRouter } from './UI/blogs-router';
import { deleteAllRouter } from './UI/delete-all-users';
import { postsRouter } from './UI/posts-router';
import  cookieParser  from 'cookie-parser';
import express from 'express'

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
