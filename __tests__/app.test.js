require("dotenv").config();
const app = require("../app");
const agent = require("supertest");
const mongoose = require("mongoose");
/* Connecting to the database before each test. */
// beforeEach(async () => {
//   await mongoose.connect(process.env.TEST_URI);
// });

// /* Closing database connection after each test. */
// afterEach(async () => {
//   await mongoose.connection.close();
// });

beforeAll(async () => await mongoose.connect(process.env.TEST_URI));

afterEach(async () => await mongoose.connection.clearDatabase());

afterAll(async () => await mongoose.connection.closeDatabase());

describe("Blog API test", () => {
  describe("Not Found Pages", () => {
    //Post Route
    it("should return a 404 error", async () => {
      await agent(app)
        .post("/testing_unknown_route")
        .expect("Content-Type", /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: "Route does not exist",
            })
          );
        });
    });
    //Get Route
    it("should return a 404 error", async () => {
      await agent(app)
        .get("/testing_unknown_route")
        .expect("Content-Type", /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: "Route does not exist",
            })
          );
        });
    });
    //Patch Method
    it("should return a 404 error", async () => {
      await agent(app)
        .patch("/testing_unknown_route")
        .expect("Content-Type", /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: "Route does not exist",
            })
          );
        });
    });
    //Delete Method
    it("should return a 404 error", async () => {
      await agent(app)
        .delete("/testing_unknown_route")
        .expect("Content-Type", /json/)
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              message: "Route does not exist",
            })
          );
        });
    });
  });
  describe("User Routes", () => {
    it("should create a new user", async () => {
      await agent(app)
        .post("/api/v1/signup")
        .send({
          firstname: "Boluwatife",
          lastname: "Farinu",
          email: "farinubolu@gmail.com",
          password: "Bolu1234",
          securityQuestion: "Lion",
        })
        // .expect(401)
        .expect("Content-Type", /json/)
        .then((response) => {
          expect(response.statusCode).toBe(201);
        });
    });
  });
});
