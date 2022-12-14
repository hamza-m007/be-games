const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.selectCategories = () => {
  return db.query("SELECT * FROM categories").then((result) => {
    return result.rows;
  });
};

exports.selectReviews = () => {
  return db
    .query(
      `
  SELECT 
  owner, 
  title, 
  reviews.review_id, 
  category, 
  review_body,
  review_img_url, 
  reviews.created_at, 
  reviews.votes, 
  designer, 
  COUNT (comments.review_id) AS comment_count 
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id 
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;
  `
    )
    .then((reviewData) => {
      return reviewData.rows;
    });
};

exports.selectReviewById = (review_id) => {
  return db
    .query(
      `
    SELECT 
    COUNT (comments.review_id) AS comment_count, reviews.* 
    FROM reviews 
    LEFT JOIN comments 
    ON reviews.review_id = comments.review_id 
    WHERE reviews.review_id = $1 
    GROUP BY reviews.review_id
    `,
      [review_id]
    )
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Review not found!" });
      }
      return res.rows[0];
    });
};

exports.selectCommentsByReviewId = (review_id) => {
  return checkExists("reviews", "review_id", review_id).then(() => {
    return db
      .query(
        `
      SELECT * FROM comments
      WHERE review_id = $1
      ORDER BY created_at DESC 
      `,
        [review_id]
      )
      .then((res) => {
        return res.rows;
      });
  });
};

exports.insertComment = (review_id, body, author) => {
  return checkExists("users", "username", author)
    .then(() => {
      return checkExists("reviews", "review_id", review_id);
    })
    .then(() => {
      return db.query(
        `
        INSERT INTO comments
        (review_id, author, body)
        VALUES
        ($1, $2, $3)
        RETURNING *
        `,
        [review_id, author, body]
      );
    })
    .then((res) => {
      return res.rows[0];
    });
};

exports.updateReviewById = (review_id, inc_votes) => {
  return checkExists("reviews", "review_id", review_id)
    .then(() => {
      return db.query(
        `
    UPDATE reviews
    SET votes = votes + $1
    WHERE review_id = $2
    RETURNING *;
    `,
        [inc_votes, review_id]
      );
    })
    .then((res) => {
      return res.rows;
    });
};

exports.selectUsers = () => {
  return db
    .query(
      `
    SELECT * FROM users
    `
    )
    .then((result) => {
      return result.rows;
    });
};
