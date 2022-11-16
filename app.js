const express = require("express");
const app = express();
const {
  getCategories,
  getReviews,
  getReviewById,
} = require("./controllers/games.controllers");
const {
  catchAll,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors.controllers");

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

app.use(handlePSQLErrors);

app.use(handleCustomErrors);

app.use(catchAll);

module.exports = app;
