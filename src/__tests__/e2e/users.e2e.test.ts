import mongoose from "mongoose";
import { runDb, stopDb } from "../../db/db";
import request from 'supertest'
import { initApp } from "../../settings";
import { HTTP_STATUS } from "../../utils/utils";

const mongoURI = process.env.mongoURI || "mongodb://0.0.0.0:27017";
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

  describe('/users', () => {
	beforeAll(async() => {
		await runDb()
		
		const wipeAllRes = await request(app).delete('/testing/all-data').send()
		expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204)

		const getPosts = await request(app).get('/users').auth("admin", "qwerty")
		expect(getPosts.status).toBe(HTTP_STATUS.OK_200)

		expect(getPosts.body.items).toHaveLength(0)
	})


	afterAll(async() => {
		//await stop()
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

	it("POST -> /users: should create new user; status 201; content: created user; used additional methods: GET => /users", async () => {
      const user = {
		"login": "qwerty",
		"password": "string",
		"email": "mpara7473@gmail.com"
	  }
	  const resultOfUserCreation = await request(app).post('/users').auth("admin", "qwerty").send(user)
	  expect(resultOfUserCreation.status).toBe(HTTP_STATUS.CREATED_201)
	  expect(resultOfUserCreation.body).toEqual({
		"id": expect.any(String),
		"login": user.login,
		"email": user.email,
		"createdAt": expect.any(String)
	  })
	//   let pageNumber = "1";
      let pageSize = 50;
      //let sortBy = "createdAt";
      //let sortDirection = "desc";
	  //let searchLoginTerm = null
	  //let searchEmailTerm = null
	  const findUser = await request(app).get(`/users?pageSize=${pageSize}`).auth("admin", "qwerty")
	  expect(findUser.status).toBe(HTTP_STATUS.OK_200)
	  expect(findUser.body).toEqual({
		"pagesCount": 1,
		"page": 1,
		"pageSize": 50,
		"totalCount": 1,
		"items": [
		  {
			"id": expect.any(String),
			"login": user.login,
			"email": user.email,
			"createdAt": expect.any(String)
		  }
		]
	  })
    });
  })