const express = require("express");
const { selectReviewById } = require("../models/games.models");
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

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
