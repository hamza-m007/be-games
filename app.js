const express = require("express");
const app = express();
const cors = require('cors')
const {
  getCategories,
  getReviews,
  getReviewById,
  getCommentsByReviewId,
  postComment,
  patchReview,
  getUsers,
} = require("./controllers/games.controllers");
const {
  catchAll,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controllers");

app.use(cors())

app.use(express.json())

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewId)

app.post("/api/reviews/:review_id/comments", postComment)

app.patch("/api/reviews/:review_id", patchReview)

app.get("/api/users", getUsers)

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(catchAll);

module.exports = app;
