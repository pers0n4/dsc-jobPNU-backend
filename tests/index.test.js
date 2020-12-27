const supertest = require("supertest");
const mongoose = require("mongoose");

require("../config/env");
const { app } = require("../app");

const request = supertest.agent(app);

beforeAll(async () => {
  try {
    // connect by root account for create test user
    const client = await mongoose.mongo.MongoClient.connect(
      "mongodb://root:pass@localhost:27017",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    // delete test user, if existed
    (
      await client.db("jest").command({
        usersInfo: 1,
      })
    ).users && (await client.db("jest").removeUser("jest"));

    // LINK https://docs.mongodb.com/v3.2/reference/built-in-roles/
    await client.db("jest").addUser("jest", "jest", {
      roles: [{ role: "readWrite", db: "jest" }],
    });
    await client.close();

    await mongoose.connect("mongodb://jest:jest@localhost:27017/jest", {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Database connection fail");
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("User", () => {
  const email = "test@example.com";
  const password = "password";
  let userId;
  let token;

  test("create user", (done) => {
    request
      .post("/users")
      .send({
        email,
        password,
        name: "name",
      })
      .expect(201)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        userId = res.body.id;
        return done();
      });
  });

  test("prevent duplicated email user", (done) => {
    request
      .post("/users")
      .send({
        email,
        password,
        name: "name",
      })
      .expect(400, done);
  });

  test("authenticate user", (done) => {
    request
      .post("/auth")
      .send({
        email,
        password,
      })
      .expect((res) => {
        token = res.body.token;
        expect(token).toBeTruthy();
      })
      .end(done);
  });

  test("refresh token", (done) => {
    request
      .post("/auth/refresh")
      .set("Authorization", `Bearer ${token}`)
      .expect((res) => {
        expect(res.body.token).toBeTruthy();
      })
      .end(done);
  });

  test("update user", (done) => {
    request
      .patch(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "updated",
      })
      .expect(200, done);
  });

  test("delete user", (done) => {
    request
      .delete(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204, done);
  });
});
