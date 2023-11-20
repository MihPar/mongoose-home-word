import { securityDeviceRouter } from './UI/securityDevice-controller';
import { commentsRouter } from './UI/comments-controller';
import { usersRouter } from './UI/users-controller';
import { authRouter } from './UI/auth-controller';
import { blogsRouter } from './UI/blogs-controller';
import { deleteAllRouter } from './UI/delete-all-users';
import { postsRouter } from './UI/posts-controller';
import  cookieParser  from 'cookie-parser';
import express from 'express'


export const initApp =()=>{
	const app = express()

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
return app;
}
	