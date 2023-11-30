import { stopDb } from "../../db/db";
import request from 'supertest'
import { initApp } from "../../settings";
import { HTTP_STATUS } from "../../utils/utils";
import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.mongoDBName || 'mongoose-example'

const app = initApp()

export function createErrorsMessageTest(fields: string[]) {
	const errorsMessages: any = [];
	for (const field of fields) {
	  errorsMessages.push({
		message: expect.any(String),
		field: field ?? expect.any(String),
	  });
	}
	return { errorsMessages: errorsMessages };
  }

  describe('/posts', () => {
	beforeAll(async() => {
		// await runDb()
		// console.log(mongoURI, ': MongoURI')
		// console.log(mongoURI, ': e')
		await mongoose.connect(mongoURI)

		const wipeAllRes = await request(app).delete('/testing/all-data')
		expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204)

		const getPosts = await request(app).get('/posts')
		expect(getPosts.status).toBe(HTTP_STATUS.OK_200)

		expect(getPosts.body.items).toHaveLength(0)
	})

	afterAll(async() => {
		// await stop()
		await stopDb()
	})

	afterAll((done) => {
		done()
	})

	const blogsValidationErrRes = {
		errorsMessages: expect.arrayContaining([
		  {
			message: expect.any(String),
			field: "name",
		  },
		  {
			message: expect.any(String),
			field: "description",
		  },
		  {
			message: expect.any(String),
			field: "websiteUrl",
		  },
		]),
	  };

	  beforeEach(async() => {
		const wipeAllRes = await request(app).delete('/testing/all-data').send()
	})

		

		it("POST -> /posts/:postId/comments: should create new comment; status 201; content: created comment; used additional methods: POST -> /blogs, POST -> /posts, GET -> /comments/:commentId;", async () => {
			// create user(login, psw)!!!!!!
			//accwessToken = loginUser
			//blogId = createBlog
			//postId = createPost
			//comment = createComment

			const createUser = await request(app).post('/users').auth("admin", "qwerty").send({
				"login": "Mickle",
				"password": "qwerty",
				"email": "mpara7472@gmail.com"
			})
			// console.log(createUser.body)

			expect(createUser.status).toBe(HTTP_STATUS.CREATED_201)
			expect(createUser.body).toEqual({
				"id": expect.any(String),
				"login": "Mickle",
				"email": "mpara7472@gmail.com",
				"createdAt": expect.any(String)
			})
			// console.log(createUser.body.login)

			const loginOrEmail = createUser.body.login
			const createAccessToken = await request(app).post('/auth/login').send({
				"loginOrEmail": loginOrEmail,
  				"password": "qwerty"
			})

			// console.log(createAccessToken.body);

			expect(createAccessToken.status).toBe(HTTP_STATUS.OK_200)
			expect(createAccessToken.body).toEqual({
				"accessToken": expect.any(String)
			})

			const createBlogs = await request(app)
				.post("/blogs")
				.auth("admin", "qwerty")
				.send({
					name: "Mickle",
					description: "my description",
					websiteUrl: "https://learn.javascript.ru",
					});
			expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
			expect(createBlogs.body).toEqual({
				id: expect.any(String),
				name: "Mickle",
				description: "my description",
				websiteUrl: "https://learn.javascript.ru",
				createdAt: expect.any(String),
				isMembership: true,
			});

			const blogId = createBlogs.body.id
			const blogName = createBlogs.body.name

			// console.log("blogId: ", blogId)
			const createPosts = await request(app).post('/posts').auth("admin", "qwerty").send({
				"title": "new title",
				"shortDescription": "new shortDescription",
				"content": "myContent I like javascript and I will be a developer in javascript, back end developer",
				"blogId": blogId
			})
			// console.log(createPosts.body)

			expect(createPosts.status).toBe(HTTP_STATUS.CREATED_201)
			// console.log(createPosts.body)
			expect(createPosts.body).toEqual({
				"id":  expect.any(String),
				"title": "new title",
				"shortDescription": "new shortDescription",
				"content": "myContent I like javascript and I will be a developer in javascript, back end developer",
				"blogId": blogId,
				"blogName": blogName,
				"createdAt": expect.any(String)
			})

			// console.log(createAccessToken.body.accessToken)
			const postId = createPosts.body.id
			const userId = createUser.body.id
			const login = createUser.body.login

			const createCommentPostByPostId = await request(app)
				.post(`/posts/${postId}/comments`)
				.set('Authorization', `Bearer ${createAccessToken.body.accessToken}`)
				.send({
					"content": "My profession is a programmer, I work in javascript and I work for back end developer"
				})
			// console.log(createCommentPostByPostId.body)

			expect(createCommentPostByPostId.status).toBe(HTTP_STATUS.CREATED_201);
			expect(createCommentPostByPostId.body).toEqual({
				id: expect.any(String),
				content: expect.any(String),
				commentatorInfo: {
					userId: userId,
					userLogin: login,
					},
				createdAt: expect.any(String),
				likesInfo: {
					likesCount: 0,
					dislikesCount: 0,
					myStatus: "None",
					},
			});

			const id = createCommentPostByPostId.body.id
			console.log(createCommentPostByPostId.body)
			const getComment = await request(app).get(`/comments/${id}`)

			console.log(getComment.body)
			console.log(getComment.status)

			expect(getComment.status).toBe(HTTP_STATUS.OK_200)
			expect(getComment.body).toEqual({
					"id": id,
					"content": expect.any(String),
					"commentatorInfo": {
					  "userId": userId,
					  "userLogin": login
					},
					"createdAt": expect.any(String),
					"likesInfo": {
					  "likesCount": 0,
					  "dislikesCount": 0,
					  "myStatus": "None"
				  }
			})
			// expect(commentId).toEqual(expect.any(String))
		})

			

// 			
// 			

			
// //create comment
// 			let commentId = expect.any(String)
			

//     });


/*******************************************************************************************************/

	// 	it('create post by id', async() => {
	// 		const inputDate = {
	// 			postId: '',
	// 			content: '',
	// 			user: ''
	// 		}
	// 		const createPostByPostId = await request(app).post('/posts').send(inputDate)
	// 		expect(createPostByPostId.status).toBe(HTTP_STATUS.CREATED_201)
	// 	})

	// 	it('get all posts', async() => {
	// 		const inputData = {
	// 			pageNumber: "1",
	// 			pageSize: "10",
	// 			sortBy: "createdAt",
	// 			sortDirection: "desc",
	// 		  }
	// 		  const getAllPosts = await request(app).get('/posts').send(inputData)
	// 		  expect(getAllPosts.status).toBe(HTTP_STATUS.OK_200)
	// 	})

	// 	it('create post', async() => {
	// 		const inputData =  { title: 'title', shortDescription: 'string', content: 'None', blogId: '' }
	// 		const createPost = await request(app).post('/posts').send(inputData)
	// 		expect(createPost.status).toBe(HTTP_STATUS.CREATED_201)
	// 	})

	// 	it('find post by postId', async() => {
	// 		const id = ''
	// 		const getPostByPostId = await request(app).get('/posts').send(id)
	// 		expect(getPostByPostId.status).toBe(HTTP_STATUS.OK_200)
	// 	})

	// 	it('update post by id', async() => {
	// 		const 
	// 	})
	//   })
	})