exports.catchAll = (err, res, req, next) => {
  console.log("Unhandled error: ", err);
  res.status(500).send({ msg: "Server error!" });
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg })
  } else {
    next(err)
  }
}

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Bad request!' })
  } else {
    next(err)
  }
}
