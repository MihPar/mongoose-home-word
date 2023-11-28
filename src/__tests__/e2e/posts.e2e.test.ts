// import mongoose from "mongoose";
// import { runDb } from "../../db/db";
// import request from 'supertest'
// import { initApp } from "../../settings";
// import { HTTP_STATUS } from "../../utils/utils";

// const mongoURI = process.env.mongoURI || "mongodb://0.0.0.0:27017";
// let dbName = process.env.mongoDBName || 'mongoose-example'

// const app = initApp()

// export function createErrorsMessageTest(fields: string[]) {
// 	const errorsMessages: any = [];
// 	for (const field of fields) {
// 	  errorsMessages.push({
// 		message: expect.any(String),
// 		field: field ?? expect.any(String),
// 	  });
// 	}
// 	return { errorsMessages: errorsMessages };
//   }

//   describe('/posts', () => {
// 	beforeAll(async() => {
// 		await runDb()
// 		await mongoose.connect(mongoURI + '/' + dbName)

// 		const wipeAllRes = await request(app).delete('/testing/all-data').send()
// 		expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204)

// 		const getPosts = await request(app).get('/posts').send()
// 		expect(getPosts.status).toBe(HTTP_STATUS.OK_200)

// 		expect(getPosts.body.items).toHaveLength(0)
// 	})

// 	beforeAll(async() => {
// 		await stop()
// 		await mongoose.connection.close()
// 	})

// 	const blogsValidationErrRes = {
// 		errorsMessages: expect.arrayContaining([
// 		  {
// 			message: expect.any(String),
// 			field: "name",
// 		  },
// 		  {
// 			message: expect.any(String),
// 			field: "description",
// 		  },
// 		  {
// 			message: expect.any(String),
// 			field: "websiteUrl",
// 		  },
// 		]),
// 	  };


// 	  describe('create post test', async() => {

// 		it("find post by postId", async () => {
//       let pageNumber = "1";
//       let pageSize = "10";
//       let sortBy = "createdAt";
//       let sortDirection = "desc";
//       const getPostByPostId = await request(app)
//         .get(
//           `/posts?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`
//         ).set("Authorization", `Bearer ${}`)
//       expect(getPostByPostId.status).toBe(HTTP_STATUS.OK_200);
//     });

// 		it('create post by id', async() => {
// 			const inputDate = {
// 				postId: '',
// 				content: '',
// 				user: ''
// 			}
// 			const createPostByPostId = await request(app).post('/posts').send(inputDate)
// 			expect(createPostByPostId.status).toBe(HTTP_STATUS.CREATED_201)
// 		})

// 		it('get all posts', async() => {
// 			const inputData = {
// 				pageNumber: "1",
// 				pageSize: "10",
// 				sortBy: "createdAt",
// 				sortDirection: "desc",
// 			  }
// 			  const getAllPosts = await request(app).get('/posts').send(inputData)
// 			  expect(getAllPosts.status).toBe(HTTP_STATUS.OK_200)
// 		})

// 		it('create post', async() => {
// 			const inputData =  { title: 'title', shortDescription: 'string', content: 'None', blogId: '' }
// 			const createPost = await request(app).post('/posts').send(inputData)
// 			expect(createPost.status).toBe(HTTP_STATUS.CREATED_201)
// 		})

// 		it('find post by postId', async() => {
// 			const id = ''
// 			const getPostByPostId = await request(app).get('/posts').send(id)
// 			expect(getPostByPostId.status).toBe(HTTP_STATUS.OK_200)
// 		})

// 		it('update post by id', async() => {
// 			const 
// 		})
// 	  })
//   })