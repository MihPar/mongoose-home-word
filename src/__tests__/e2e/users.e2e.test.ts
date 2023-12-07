import { stopDb } from "../../db/db";
import request from "supertest";
import { initApp } from "../../settings";
import { HTTP_STATUS } from "../../utils/utils";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { UserViewType } from "../../types/userTypes";
dotenv.config();

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.mongoDBName || "mongoose-example";

const app = initApp();

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

describe("/users", () => {
  beforeAll(async () => {
    // await runDb()
    await mongoose.connect(mongoURI);

    const wipeAllRes = await request(app).delete("/testing/all-data").send();
    expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);

    const getUsers = await request(app).get("/users").auth("admin", "qwerty");
    expect(getUsers.status).toBe(HTTP_STATUS.OK_200);

    expect(getUsers.body.items).toHaveLength(0);
  });

  afterAll(async () => {
    //await stop()
    await stopDb();
  });

  afterAll((done) => {
    done();
  });

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

  //   beforeEach(async () => {
  //     const wipeAllRes = await request(app).delete("/testing/all-data").send();
  //   });
  let createUser: UserViewType;
  describe("add new user to the system", () => {
    it("should create new user with correct input data => return status 201", async () => {
      const user = {
        login: "qwerty",
        password: "string",
        email: "mpara7473@gmail.com",
      };
      const resultOfUserCreation = await request(app)
        .post("/users")
        .auth("admin", "qwerty")
        .send(user);
      createUser = resultOfUserCreation.body;
      expect(resultOfUserCreation.status).toBe(HTTP_STATUS.CREATED_201);
      expect(createUser).toEqual({
        id: expect.any(String),
        login: user.login,
        email: user.email,
        createdAt: expect.any(String),
      });
    });
    it("should create new user without correct input data => return 400 status code", async () => {
      const user = {
        login: true,
        password: 123,
        email: "mpara7473@gmail.com",
      };
      const resultOfUserCreation = await request(app)
        .post("/users")
		.auth("admin", "qwerty")
        .send(user);
      createUser = resultOfUserCreation.body;
      expect(resultOfUserCreation.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
	  expect(createUser).toEqual(
		createErrorsMessageTest(["login", "password", "email"])
	  );
    });
	it("should create new user without authorization => return 401 status code", async () => {
		const user = {
			login: "qwerty",
			password: "string",
			email: "mpara7473@gmail.com",
		};
		const resultOfUserCreation = await request(app)
		  .post("/users")
		  .send(user);
		createUser = resultOfUserCreation.body;
		expect(resultOfUserCreation.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401);
		
	  });
  });
  describe("return all users", () => {
    it("get all users with correct input data => return 200 status code", async () => {
      let sortBy = "createdAt";
      let sortDirection = "desc";
      let pageNumber = "1";
      let pageSize = 50;
      let searchLoginTerm = null;
      let searchEmailTerm = null;
      const findUser = await request(app)
        .get(
          `/users?sortBy=${sortBy}&sortDirection=${sortDirection}&pageNumber=${pageNumber}&pageSize=${pageSize}&searchLoginTerm=${searchLoginTerm}&searchEmailTerm=${searchEmailTerm}`
        )
        .auth("admin", "qwerty");
      expect(findUser.status).toBe(HTTP_STATUS.OK_200);
      expect(findUser.body).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 50,
        totalCount: 0,
        items: [
          {
            id: createUser.id,
            login: createUser.login,
            email: createUser.email,
            createdAt: expect.any(String),
          },
        ],
      });
    });
	it("get all users without authorization => return 401 status code", async () => {
		let sortBy = "createdAt";
		let sortDirection = "desc";
		let pageNumber = "1";
		let pageSize = 50;
		let searchLoginTerm = null;
		let searchEmailTerm = null;
		const findUser = await request(app)
		  .get(
			`/users?sortBy=${sortBy}&sortDirection=${sortDirection}&pageNumber=${pageNumber}&pageSize=${pageSize}&searchLoginTerm=${searchLoginTerm}&searchEmailTerm=${searchEmailTerm}`
		  )
		expect(findUser.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401);
	  });
  });

  describe("delete user specified by id", () => {
	it("delete user with correct input data => return 204 status code", async() => {
		const deleteUserById = await request(app)
		.delete(`/users/${createUser.id}`)
		.auth("admin", "qwerty")
		expect(deleteUserById.status).toBe(HTTP_STATUS.NO_CONTENT_204)
	})
	it("delete user without authorization => return 401 status code", async() => {
		const deleteUserById = await request(app)
		.delete(`/users/${createUser.id}`)
		expect(deleteUserById.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401)
	})
	it("delete user with incorrect input data => return 404 status code", async() => {
		const deleteUserById = await request(app)
		.delete(`/users`)
		.auth("admin", "qwerty")
		expect(deleteUserById.status).toBe(HTTP_STATUS.NOT_FOUND_404)
	})
  })
});
