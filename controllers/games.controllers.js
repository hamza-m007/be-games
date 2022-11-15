const express = require("express");
const { selectCategories, selectReviews } = require("../models/games.models");

exports.getCategories = (req, res, next) => {
  selectCategories()
    .then((allCategories) => {
      res.status(200).send({ categories: allCategories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  selectReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};
