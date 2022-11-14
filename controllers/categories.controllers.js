const express = require("express");
const { selectCategories } = require("../models/categories.models");

exports.getCategories = (req, res, next) => {
  selectCategories().then((allCategories) => {
    res.status(200).send({ categories: allCategories });
  });
};
