const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return db.end();
});

describe("/api/categories", () => {
  test("GET - 200: sends an array of categories objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        res.body.categories.forEach((item) =>
          expect(item).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
        expect(res.body.categories.length).toBe(4);
      });
  });
});

describe("bad paths", () => {
  test("GET - 404: invalid request responds with 'Not found!'", () => {
    return request(app)
      .get("/api/cateegor")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not found!");
      });
  });
});
