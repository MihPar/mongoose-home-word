import { securityDeviceRouter } from './Controllers/securityDevice-controller';
import { commentsRouter } from './Controllers/comments-controller';
import { usersRouter } from './Controllers/users-controller';
import { authRouter } from './Controllers/auth-controller';
import { blogsRouter } from './Controllers/blogs-controller';
import { deleteAllRouter } from './Controllers/delete-all-users';
import { postsRouter } from './Controllers/posts-controller';
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
	