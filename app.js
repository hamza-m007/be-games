const express = require("express");
const { getCategories } = require("./controllers/categories.controllers");
const { catchAll } = require("./controllers/errors.controllers");
const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Not found!" });
});

app.use(catchAll);

module.exports = app;
