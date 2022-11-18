const express = require("express");
const {
  selectReviewById,
  selectCommentsByReviewId,
  insertComment,
  updateReviewById,
} = require("../models/games.models");
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

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  selectCommentsByReviewId(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const { body, username } = req.body;
  if (!body || !username) {
    res.status(400).send({ msg: "Missing input data!" });
  } else {
    insertComment(review_id, body, username)
      .then((addedComment) => {
        res.status(201).send({ comment: addedComment });
      })
      .catch(next);
  }
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes } = req.body;
  if (!inc_votes || typeof inc_votes !== "number") {
    res.status(400).send({ msg: "Missing input data!" });
  } else {
    updateReviewById(review_id, inc_votes)
      .then((updatedReview) => {
        res.status(200).send({ review: updatedReview });
      })
      .catch(next);
  }
};
