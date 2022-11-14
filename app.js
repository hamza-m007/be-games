const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

// errors

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found!" });
});

app.use((err, req, res, next) => {
  console.log("Unhandled error: ", err);
  res.sendStatus(500);
});

module.exports = app;
