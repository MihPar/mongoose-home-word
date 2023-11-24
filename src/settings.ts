
import  cookieParser  from 'cookie-parser';
import express from 'express'
import { blogsRouter } from './Routers/blogs-router';
import { postsRouter } from './Routers/posts-router';
import { deleteAllRouter } from './Routers/deleteAllModels';
import { authRouter } from './Routers/auth-router';
import { usersRouter } from './Routers/user-router';
import { commentsRouter } from './Routers/comment-router';
import { securityDeviceRouter } from './Routers/securityDevice-router';


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
	