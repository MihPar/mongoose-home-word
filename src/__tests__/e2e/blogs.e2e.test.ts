import { app } from "../../settings";
import request from "supertest";
import dotenv from "dotenv";
import { HTTP_STATUS } from "../../utils";
import { runDb, stopDb } from "../../db/db";
import { randomUUID } from "crypto";
import mongoose from 'mongoose'
dotenv.config();

const mongoURI = process.env.mongoURI || "mongodb://0.0.0.0:27017";
let dbName = process.env.mongoDBName || 'mongoose-example'

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
    await runDb();
	await mongoose.connect(mongoURI + '/' + dbName)

    const wipeAllRes = await request(app).delete("/testing/all-data").send();

    expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);

    const getBlogs = await request(app).get("/blogs").send();
    expect(getBlogs.status).toBe(HTTP_STATUS.OK_200);
    expect(getBlogs.body.items).toHaveLength(0);
  });

  afterAll(async () => {
    await stopDb();
	await mongoose.connection.close()
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

  describe("create blog tests", async () => {
    
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

      expect(createBlogWithEmptyBody.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
      expect(createBlogWithEmptyBody.body).toStrictEqual(createErrorsMessageTest(["name", "description", "websiteUrl"]));
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
