exports.catchAll = (err, res, req, next) => {
  console.log("Unhandled error: ", err);
  res.status(500).send({ msg: "Server error!" });
};
