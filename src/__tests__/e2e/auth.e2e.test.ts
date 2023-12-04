// // expect(result1.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
// //       expect(result1.body.accessToken).toBeDefined();
// //       expect(result1.headers['set-cookie'][0]).toBeDefined();
// //       accessToken = result1.body.accessToken;
// //       refreshToken = result1.headers['set-cookie'][0];

// import { stopDb } from "../../db/db";
// import request from "supertest";
// import { initApp } from "../../settings";
// import { HTTP_STATUS } from "../../utils/utils";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import { UserViewType } from "../../types/userTypes";
// dotenv.config();

// const mongoURI = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";
// let dbName = process.env.mongoDBName || "mongoose-example";

// const app = initApp();

// export function createErrorsMessageTest(fields: string[]) {
//   const errorsMessages: any = [];
//   for (const field of fields) {
//     errorsMessages.push({
//       message: expect.any(String),
//       field: field ?? expect.any(String),
//     });
//   }
//   return { errorsMessages: errorsMessages };
// }

// describe("/auth", () => {
//   let createUser: UserViewType;
//   beforeAll(async () => {
//     // await runDb()
//     await mongoose.connect(mongoURI);

//     const wipeAllRes = await request(app).delete("/testing/all-data");
//     expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);

//     createUser = await request(app)
//       .post("/users")
//       .auth("admin", "qwerty")
//       .send({
//         login: "Mickle",
//         password: "qwerty",
//         email: "mpara7472@gmail.com",
//       });
//     expect(createUser.status).toBe(HTTP_STATUS.CREATED_201);
//     expect(createUser.body).toEqual({
//       id: expect.any(String),
//       login: "Mickle",
//       email: "mpara7472@gmail.com",
//       createdAt: expect.any(String),
//     });
//   });
//   afterAll(async () => {
//     // await stop()
//     await stopDb();
//   });

//   afterAll((done) => {
//     done();
//   });

//   const authValidationErrRes = {
//     errorsMessages: expect.arrayContaining([
//       {
//         message: expect.any(String),
//         field: "name",
//       },
//       {
//         message: expect.any(String),
//         field: "description",
//       },
//       {
//         message: expect.any(String),
//         field: "websiteUrl",
//       },
//     ]),
//   };

//   beforeEach(async () => {
//     const wipeAllRes = await request(app).delete("/testing/all-data").send();
//   });
//   describe("/auth/login", async () => {
//     it("try login user to the system", async () => {
//       const createAuthLogin = await request(app).post("/auth/login").send({
//         loginOrEmail: "Michail",
//         password: "qwerty",
//       });
//       expect(createAuthLogin.status).toBe(HTTP_STATUS.OK_200);
//       expect(createAuthLogin.body).toEqual({
//         accessToken: expect.any(String),
//       });
//     });
//     it("input model has incorrect value", async () => {
//       const incorrectData = await request(app).post("/auth/login").send({
//         loginOrEmail: "Michail!!!!!!!!!!!!!!!",
//         password: "qwerty%%%%%%%%%%%%",
//       });
//       expect(incorrectData.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
//       expect(incorrectData.body).toEqual(authValidationErrRes);
//     });

//     it("input model has incorrect value", async () => {
//       const incorrectData = await request(app).post("/auth/login").send({
//         loginOrEmail: "Michaal",
//         password: "qwertt",
//       });
//       expect(incorrectData.status).toBe(HTTP_STATUS.NOT_AUTHORIZATION_401);
//       expect(incorrectData.body).toEqual(authValidationErrRes);
//     });

//     let createAuthLogin1;
//     it("try five login in system", async () => {
//       createAuthLogin1 = await request(app).post("/auth/login").send({
//         loginOrEmail: "Michail",
//         password: "qwerty1",
//       });

//       createAuthLogin1 = await request(app).post("/auth/login").send({
//         loginOrEmail: "Michail",
//         password: "qwerty2",
//       });

//       createAuthLogin1 = await request(app).post("/auth/login").send({
//         loginOrEmail: "Michail",
//         password: "qwerty3",
//       });

//       createAuthLogin1 = await request(app).post("/auth/login").send({
//         loginOrEmail: "Michail",
//         password: "qwerty",
//       });

//       createAuthLogin1 = await request(app).post("/auth/login").send({
//         loginOrEmail: "Michail",
//         password: "qwerty5",
//       });

//       expect(createAuthLogin1.status).toBe(HTTP_STATUS.HTTP_STATUS_429);
//     });
//     const wipeAllRes = await request(app).delete("/testing/all-data");
//     expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);
//   });

//   describe("/auth/password-recowery", async () => {
//     it("password is recovery", async () => {
//       const recoveryPassword = await request(app)
//         .post("/auth/password-recovery")
//         .send({ emaiil: "mpara7274@gmail.com" });
//       expect(recoveryPassword.status).toBe(HTTP_STATUS.NO_CONTENT_204);
//     });

//     it("input date is invalide", async () => {
//       const recoveryPassword = await request(app)
//         .post("/auth/password-recovery")
//         .send({ emaiil: "mpara7274#mail.com" });
//       expect(recoveryPassword.status).toBe(HTTP_STATUS.BAD_REQUEST_400);
//     });

//     let recoveryPassword;
//     it("more then five attempts", async () => {
//       recoveryPassword = await request(app)
//         .post("/auth/password-recovery")
//         .send({ emaiil: "mpara274@gmail.com" });
//       recoveryPassword = await request(app)
//         .post("/auth/password-recovery")
//         .send({ emaiil: "mpara74@gmail.com" });
//       recoveryPassword = await request(app)
//         .post("/auth/password-recovery")
//         .send({ emaiil: "mpara4@gmail.com" });
//       recoveryPassword = await request(app)
//         .post("/auth/password-recovery")
//         .send({ emaiil: "mpara7@gmail.com" });
//       recoveryPassword = await request(app)
//         .post("/auth/password-recovery")
//         .send({ emaiil: "mpara@gmail.com" });
//       recoveryPassword = await request(app)
//         .post("/auth/password-recovery")
//         .send({ emaiil: "mpar74@gmail.com" });
//       expect(recoveryPassword.status).toBe(HTTP_STATUS.HTTP_STATUS_429);
//     });
//     const wipeAllRes = await request(app).delete("/testing/all-data");
//     expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);
//   });

//   describe("/auth/new-password", async () => {
//     it("confirm password recovery", async () => {
//       const recoveryPassword = await request(app)
//         .post("/auth/recovery-password")
//         .send({
//           newPassword: "authPassword",
//           recoveryCode: "authPassword",
//         });
//       expect(recoveryPassword.status).toBe(HTTP_STATUS.NO_CONTENT_204);
//     });

//     it("input data is incorrect", async () => {
//       await request(app)
//         .post("/auth/recovery-password")
//         .send({
//           newPassword: "authPassworddddddddddddddddddddddd",
//           recoveryCode: "authPassworddddddddddddddddddddddd",
//         })
//         .expect(HTTP_STATUS.BAD_REQUEST_400, authValidationErrRes);
//     });
//     const wipeAllRes = await request(app).delete("/testing/all-data");
//     expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);
//   });

//   describe("/auth/refresh-token", async () => {
//     it("generata new pair of access token and refresh token", async (req: Request, res: Response) => {
//       const refreshToken = req.cookie.refreshToken;

//       expect(accessToken.status).toBe(HTTP_STATUS.OK_200);
//       expect(accessToken.body).toEqual({
//         accessToken: expect.any(String),
//       });
//     });
//     it("jwt is inside cookie", async () => {});
//   });
//   describe("/auth/registration-confirmationi", async () => {
//     it("confirmation registration", async () => {
//       const registrationConfirmationCode = await request(app)
//         .post("auth//auth/registration-confirmationi")
//         .send({
//           code: expect.any(String),
//         });
//       expect(registrationConfirmationCode.status).toBe(
//         HTTP_STATUS.NO_CONTENT_204
//       );
//     });
// 	it("")
//   });
// });
