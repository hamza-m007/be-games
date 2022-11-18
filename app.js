const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postComment,
  patchReview,
} = require("./controllers/games.controllers");
const {
  catchAll,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controllers");

app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId)

app.post("/api/reviews/:review_id/comments", postComment)

app.patch("/api/reviews/:review_id", patchReview)

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(catchAll);

module.exports = app;
