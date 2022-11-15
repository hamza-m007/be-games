const express = require("express");
const {
  getCategories,
  getReviews,
} = require("./controllers/games.controllers");
const { catchAll } = require("./controllers/errors.controllers");
const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

app.use(catchAll);

module.exports = app;
