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
  describe("GET requests", () => {
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
  describe("PATCH requests", () => {
    test("PATCH - 200: updates the vote count of the specified review_id and then returns the updated review", () => {
      const requestBody = { inc_votes: 2 };
      return request(app)
        .patch("/api/reviews/1")
        .send(requestBody)
        .expect(200)
        .then(({ body }) => {
          expect(body.review[0]).toMatchObject({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 3,
          });
        });
    });
    test("PATCH - 200: updates the vote count of the specified review_id and then returns the updated review when passed extra keys in the request body", () => {
      const requestBody = { inc_votes: 2, extra_key: 'extra key' };
      return request(app)
        .patch("/api/reviews/1")
        .send(requestBody)
        .expect(200)
        .then(({ body }) => {
          expect(body.review[0]).toMatchObject({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: expect.any(String),
            votes: 3,
          });
        });
    });
    test("PATCH - 404: sends an appropriate error message when passed a valid but non-existent review_id", () => {
      const requestBody = { inc_votes: 2 };
      return request(app)
        .patch("/api/reviews/100")
        .send(requestBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource not found!");
        });
    });
    test("PATCH - 400: sends an appropriate error message when passed an invalid review_id", () => {
      const requestBody = { inc_votes: 2 };
      return request(app)
        .patch("/api/reviews/hello")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
    test("PATCH - 400: sends an appropriate error message when given a invalid key in the request body", () => {
      const requestBody = { wrong_key: 2 };
      return request(app)
        .patch("/api/reviews/1")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing input data!");
        });
    });
    test("PATCH - 400: sends an appropriate error message when given a invalid data type in the request body", () => {
      const requestBody = { inc_votes: "hello" };
      return request(app)
        .patch("/api/reviews/1")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing input data!");
        });
    });
  });
});

describe("/api/reviews/:review_id/comments", () => {
  describe("GET requests", () => {
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
          });
        });
    });
    test("GET - 200: orders array of comments by most recent first", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    test("GET - 200: returns an empty array when review_id has no comments", () => {
      return request(app)
        .get("/api/reviews/1/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.comments).toEqual([]);
        });
    });
    test("GET - 404: valid but non-existent review_id returns message 'Resource not found!'", () => {
      return request(app)
        .get("/api/reviews/100/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource not found!");
        });
    });
    test("GET - 400: invalid review_id returns message 'Bad request!'", () => {
      return request(app)
        .get("/api/reviews/hello/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
  });
  describe("POST requests", () => {
    test("POST - 201: inserts a new comment into the database and responds with newly created comment", () => {
      const newBody = { username: "bainesface", body: "What a great game" };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newBody)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 7,
            votes: 0,
            created_at: expect.any(String),
            author: "bainesface",
            body: "What a great game",
            review_id: 1,
          });
        });
    });
    test("POST - 201: inserts a new comment into the database, ignoring unnecessary properties, and responds with newly created comment", () => {
      const newBody = {
        username: "bainesface",
        body: "What a great game",
        other_key: "other",
      };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newBody)
        .expect(201)
        .then(({ body }) => {
          expect(body.comment).toMatchObject({
            comment_id: 7,
            votes: 0,
            created_at: expect.any(String),
            author: "bainesface",
            body: "What a great game",
            review_id: 1,
          });
        });
    });
    test("POST - 400: responds with msg 'Missing Input Data!' when passed a bad comment (e.g. missing data)", () => {
      const newBody = { username: "bainesface" };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Missing input data!");
        });
    });
    test("POST - 404: sends an appropriate error message when given a non-existent username", () => {
      const newBody = { username: "kratos", body: "What a great game" };
      return request(app)
        .post("/api/reviews/1/comments")
        .send(newBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource not found!");
        });
    });
    test("POST - 404: sends an appropriate error message when given an invalid review_id", () => {
      const newBody = { username: "bainesface", body: "What a great game" };
      return request(app)
        .post("/api/reviews/hello/comments")
        .send(newBody)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request!");
        });
    });
    test("POST - 404: sends an appropriate error message when given an valid but non-existent review_id", () => {
      const newBody = { username: "bainesface", body: "What a great game" };
      return request(app)
        .post("/api/reviews/100/comments")
        .send(newBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Resource not found!");
        });
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
