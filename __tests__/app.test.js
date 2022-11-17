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

describe("/api/review/:review_id", () => {
  test("GET - 200: returns the single specified review", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review.length).toBe(1);
        expect(body.review[0]).toMatchObject({
          review_id: 1,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });
  test("GET - 404: valid but non-existent review_id returns message 'Review not found!'", () => {
    return request(app)
      .get("/api/reviews/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review not found!");
      });
  });
  test("GET - 400: invalid review_id returns message 'Bad request!'", () => {
    return request(app)
      .get("/api/reviews/hello")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request!");
      });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  test("GET - 200: returns an array of comments for the given review_id", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
        body.comments.forEach((item) => {
        expect(item).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          review_id: 2,
        });
        })
      });
  })
  test("GET - 200: orders array of comments by most recent first", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
      });
  })
  test("GET - 200: returns an empty array when review_id has no comments", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  })
  test("GET - 404: valid but non-existent review_id returns message 'Resource not found!'", () => {
    return request(app)
      .get("/api/reviews/100/comments")
      .expect(404)
      .then(({ body }) => {
        console.log(body);
        expect(body.msg).toBe("Resource not found!");
      });
    })
    test("GET - 400: invalid review_id returns message 'Bad request!'", () => {
      return request(app)
        .get("/api/reviews/hello")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
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
