const db = require("../db/connection");

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
