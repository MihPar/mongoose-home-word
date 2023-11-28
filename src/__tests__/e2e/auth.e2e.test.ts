
// import mongoose from 'mongoose'
// import { initApp } from '../../settings';


// const mongoURI = process.env.mongoURI || "mongodb://0.0.0.0:27017";
// let dbName = process.env.mongoDBName || 'mongoose-example'

// const app = initApp()


// describe("/blogs", () => {
// 	// beforeAll(async () => {
// 	//   await runDb();
  
// 	//   const wipeAllRes = await request(app).delete("/testing/all-data").send();
  
// 	//   expect(wipeAllRes.status).toBe(HTTP_STATUS.NO_CONTENT_204);
  
// 	//   const getBlogs = await request(app).get("/blogs").send();
// 	//   expect(getBlogs.status).toBe(HTTP_STATUS.OK_200);
// 	//   expect(getBlogs.body.items).toHaveLength(0);
// 	// });
  
// 	// afterAll(async () => {
// 	//   await stopDb();
// 	// });
  
// 	const blogsValidationErrRes = {
// 	  errorsMessages: expect.arrayContaining([
// 		{
// 		  message: expect.any(String),
// 		  field: "name",
// 		},
// 		{
// 		  message: expect.any(String),
// 		  field: "description",
// 		},
// 		{
// 		  message: expect.any(String),
// 		  field: "websiteUrl",
// 		},
// 	  ]),
// 	};

// describe(`/auth/login (POST) - login user
//                    /auth/logout (POST) - logout user`, () => {
//     let user;
//     let accessToken;
//     let refreshToken;

//     beforeAll(async () => {
//       await deleteAllDataTest(httpServer);
// 	  await mongoose.connect(mongoURI + '/' + dbName)


//       user = await usersRequestsTestManager.createUserSa(
//         httpServer,
//         freeCorrectLogin,
//         correctPass,
//         freeCorrectEmail,
//       );
//       expect(user.statusCode).toBe(HTTP_STATUS_CODE.CREATED_201);
//     });

//     it(`+ (200) should login user with passed login
//                + (200) should login user with passed email`, async () => {
//       const result1 = await loginUserTest(
//         httpServer,
//         user.body.login,
//         correctPass,
//       );
//       expect(result1.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
//       expect(result1.body.accessToken).toBeDefined();
//       expect(result1.headers['set-cookie'][0]).toBeDefined();
//       accessToken = result1.body.accessToken;
//       refreshToken = result1.headers['set-cookie'][0];

//       const result2 = await loginUserTest(
//         httpServer,
//         user.body.email,
//         correctPass,
//       );
//       expect(result2.statusCode).toBe(HTTP_STATUS_CODE.OK_200);
//     });

//     it(`- (401) should not login user because login is incorrect
//                - (401) should not login user because password is incorrect`, async () => {
//       //incorrect login
//       const result1 = await loginUserTest(
//         httpServer,
//         'IncorrectLogin',
//         correctPass,
//       );
//       expect(result1.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
//       //incorrect pass
//       const result2 = await loginUserTest(
//         httpServer,
//         user.body.login,
//         'IncorrectPass',
//       );
//       expect(result2.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
//     });

//     //dependent
//     it(`- (401) refreshToken is incorrect
//                + (204) should logout user`, async () => {
//       //incorrect refreshToken
//       const result1 = await logoutUserTest(httpServer, 'IncorrectRefreshToken');
//       expect(result1.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);

//       //logout successfully
//       const result2 = await logoutUserTest(httpServer, refreshToken);
//       expect(result2.statusCode).toBe(HTTP_STATUS_CODE.NO_CONTENT_204);
//     });

//     //dependent
//     it(`- (401) shouldn't logout user because the user has already logged out
//   and refresh token was deactivated `, async () => {
//       //refreshToken was deactivated
//       const result = await logoutUserTest(httpServer, refreshToken);
//       expect(result.statusCode).toBe(HTTP_STATUS_CODE.UNAUTHORIZED_401);
//     });
//   });

//   afterAll(async() => {
// 	await mongoose.connection.close()
//   })
  
// });