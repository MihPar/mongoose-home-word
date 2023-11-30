import { stopDb } from "../../db/db";
import request from "supertest";
import { initApp } from "../../settings";
import { HTTP_STATUS } from "../../utils/utils";
import mongoose from "mongoose";

const mongoURI = process.env.mongoURI || "mongodb://0.0.0.0:27017";
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
    // await runDb();
	await mongoose.connect(mongoURI)

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

  beforeEach(async () => {
    const wipeAllRes = await request(app).delete("/testing/all-data").send();
  });

  it("GET -> /comments/:commentId: get comment by unauthorized user. Should return liked comment with 'myStatus: None'; status 204; used additional methods: POST => /blogs, POST => /posts, POST => /posts/:postId/comments, PUT => /comments/:commentId/like-status;", async() => {



  })



});
