import request from "supertest";
import dotenv from "dotenv";
import { stopDb } from "../../db/db";
import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { HTTP_STATUS } from "../../utils/utils";
import { UserViewType } from "../../types/userTypes";
import { initApp } from "../../settings";
dotenv.config();

const app = initApp();

const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = process.env.mongoDBName || "mongoose-example";

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

describe("/blogs", () => {
  beforeAll(async () => {
    // await runDb();
    await mongoose.connect(mongoURI);

    const wipeAllRes = await request(app).delete("/testing/all-data").send();
    expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);

    // const getBlogs = await request(app).get("/blogs").send();
    // expect(getBlogs.status).toBe(HTTP_STATUS.OK_200);
    // expect(getBlogs.body.items).toHaveLength(0);
  });

  afterAll(async () => {
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

  beforeEach(async () => {
    const wipeAllRes = await request(app).delete("/testing/all-data").send();
});
	let createUser: UserViewType
	let name: string
	let description: string
	let websiteUrl: string
	let blogId: string

    describe("get and create blog tests", () => {

      it("get blogs", async () => {
        const getBlogsBefore = await request(app).get("/blogs").send();
        expect(getBlogsBefore.status).toBe(HTTP_STATUS.OK_200);
        expect(getBlogsBefore.body.items).toHaveLength(0);
      });

      it("create user, create accessToken", async () => {
		const testUser = {
            login: "Michail",
            password: "qwerty",
            email: "mpara7274@gamil.com",
          }
        const createUserResponse = await request(app)
          .post("/users")
          .auth("admin", "qwerty")
          .send(testUser);
		createUser = createUserResponse.body
        expect(createUserResponse.status).toBe(HTTP_STATUS.CREATED_201);
        expect(createUser).toEqual({
          id: expect.any(String),
          login: testUser.login,
          email: testUser.email,
          createdAt: expect.any(String),
        });

        const loginOrEmail = createUser.login;
        const createAccessToken = await request(app).post("/auth/login").send({
          loginOrEmail: loginOrEmail,
          password: "qwerty",
        });
        expect(createAccessToken.status).toBe(HTTP_STATUS.OK_200);
        expect(createAccessToken.body).toEqual({
          accessToken: expect.any(String),
        });
        const userId = createUser.id;

        it("create blogs", async () => {
          const createBlogs = await request(app)
            .post("/blogs")
            .auth("admin", "qwerty")
            .send({
              name: "Mickle",
              description: "I am a programmer",
              websiteUrl: "https://google.com",
            });

          description = createBlogs.body.description;
          websiteUrl = createBlogs.body.websiteUrl;
          name = createBlogs.body.name;
		  blogId = createBlogs.body.id

          expect(createBlogs.status).toBe(HTTP_STATUS.CREATED_201);
          expect(createBlogs.body).toEqual({
            id: expect.any(String),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: expect.any(String),
            isMembership: true,
          });
        });

		it("create blogs without authorization", async() => {
			const creteBlogsWithoutAuth = await request(app)
			.post('/blogs')
			.send({})

			expect(creteBlogsWithoutAuth.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401)
			expect(creteBlogsWithoutAuth.body).toEqual({blogsValidationErrRes})
		})
      });

	  it("return blogs with pagin", async() => {
		const searchNameTerm = ''
		const sortBy = createUser.createdAt
		const sortDirection = "desc"
		const pageNumber = "1"
		const pageSize = "10"

		const getBlogs = await request(app).get(`/blogs?searchNameTerm=${searchNameTerm}&sortBy=${sortBy}&sortDirection=${sortDirection}&pageNumber=${pageNumber}&pageSize=${pageSize}`)

		// query({searchNameTerm: '', sortBy: createUser.body.createAt, sortDirection: "desc", pageNumber: "1", pageSize: "10"})

		expect(getBlogs.status).toBe(HTTP_STATUS.OK_200)
		expect(getBlogs.body).toEqual({
			"pagesCount": 0,
			"page": 0,
			"pageSize": 0,
			"totalCount": 0,
			"items": [
				{
				"id": expect.any(String),
				"name": name,
				"description": description,
				"websiteUrl": websiteUrl,
				"createdAt": expect.any(String),
				"isMembership": true
				}
			]
		})
	  })

	  it("return all posts for specified blog", async () => {
      const createPost = await request(app).post("/posts").send({
        title: "PROGRAMMER",
        shortDescription: "My profession the back end developer!",
        content: "I am a programmere and work at backend, I like javascript!!!",
        blogId: blogId,
      });

      const title = createPost.body.title;
      const description = createPost.body.description;
      const content = createPost.body.content;

      const pageNumber = "1";
      const pageSize = "10";
      const sortBy = "desc";
      const getAllPostForBlogs = await request(app).get(
        `/blogs/${blogId}/posts`
      );

      expect(getAllPostForBlogs.status).toBe(HTTP_STATUS.OK_200);
      expect(getAllPostForBlogs.body).toEqual({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [
          {
            id: expect.any(String),
            title: title,
            shortDescription: description,
            content: content,
            blogId: blogId,
            blogName: name,
            createdAt: expect.any(String),
          },
        ],
      });

      it("if specified blog is not exist", async () => {
		const getAllPostForBlogs = await request(app).get(
			`/blogs/${blogId + 9999}/posts`
		  );
		  expect(getAllPostForBlogs.status).toBe(HTTP_STATUS.NOT_FOUND_404);
	  });
    });





      it("create blog without auth => should return 401 status code", async () => {
        const createBlogWithoutHeaders = await request(app)
          .post("/blogs")
          .send({});
        expect(createBlogWithoutHeaders.status).toBe(
          HTTP_STATUS.NOT_AUTHORIZATION_401
        );
      });

      it("create blog with incorrect auth => should return 401 status code", async () => {
        const createBlogWithIncorrectHeaders = await request(app)
          .post("/blogs")
          .auth("123", "456")
          .send({});
        expect(createBlogWithIncorrectHeaders.status).toBe(
          HTTP_STATUS.NOT_AUTHORIZATION_401
        );
      });

      it("create blog with correct auth => should not return 401 status code", async () => {
        const createBlogWithCorrectHeaders = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({});

        expect(createBlogWithCorrectHeaders.status).not.toBe(
          HTTP_STATUS.NOT_AUTHORIZATION_401
        );
      });

      it("create blog with empty body => should return 400 status code and errorsMessages", async () => {
        const createBlogWithEmptyBody = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({});

        expect(createBlogWithEmptyBody.status).toBe(
          HTTP_STATUS.BAD_REQUEST_400
        );
        expect(createBlogWithEmptyBody.body).toStrictEqual(
          createErrorsMessageTest(["name", "description", "websiteUrl"])
        );
      });

      it("create blog with incorrect body => should return 400 status code and errorsMessages", async () => {
        const createBlogWithIncorrectBody = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send({
            name: 123,
            description: true,
            websiteUrl: randomUUID(),
          });

        expect(createBlogWithIncorrectBody.status).toBe(
          HTTP_STATUS.BAD_REQUEST_400
        );
        expect(createBlogWithIncorrectBody.body).toStrictEqual(
          blogsValidationErrRes
        );
      });

      it("create blog with correct body => should return 201 status code and created blog", async () => {
        const getBlogsBefore = await request(app).get("/blogs").send();
        expect(getBlogsBefore.status).toBe(HTTP_STATUS.OK_200);
        expect(getBlogsBefore.body.items).toHaveLength(0);

        const inputData = {
          name: "name",
          description: "description",
          websiteUrl: `https://${randomUUID()}.com`,
        };

        const createBlogWithCorrectBody = await request(app)
          .post("/blogs")
          .auth("admin", "qwerty")
          .send(inputData);

        expect(createBlogWithCorrectBody.status).toBe(HTTP_STATUS.CREATED_201);
        expect(createBlogWithCorrectBody.body).toStrictEqual({
          id: expect.any(String),
          name: inputData.name,
          description: inputData.description,
          websiteUrl: inputData.websiteUrl,
          createdAt: expect.any(String),
          isMembership: false,
        });

        const getBlogsAfter = await request(app).get("/blogs").send();
        expect(getBlogsAfter.status).toBe(HTTP_STATUS.OK_200);
        expect(getBlogsAfter.body.items).toHaveLength(1);
      });
    });

    //   describe('update blogs test', async() => {

    // 	const wipeAllRes = await request(app).delete("/testing/all-data").send();

    //     expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);

    //     const getBlogs = await request(app).get("/blogs").send();
    //     expect(getBlogs.status).toBe(HTTP_STATUS.OK_200);
    //     expect(getBlogs.body.items).toHaveLength(0);

    // 	it("update blog without auth => should return 401 status code", async () => {
    // 		const createBlogWithoutHeaders = await request(app)
    // 		  .put("/blogs")
    // 		  .send({});
    // 		expect(createBlogWithoutHeaders.status).toBe(
    // 		  HTTP_STATUS.NOT_AUTHORIZATION_401
    // 		);
    // 	  });
    //   })
  
});
