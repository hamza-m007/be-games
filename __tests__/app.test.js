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

describe("/api/reviews", () => {
  test("GET - 200: returns an array of reviews with a comment count property", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews.length).toBe(13);
        res.body.reviews.forEach((item) => {
          expect(item).toMatchObject({
            review_id: expect.any(Number),
            title: expect.any(String),
            designer: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("GET - 200: orders array of reviews by decending date order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
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
