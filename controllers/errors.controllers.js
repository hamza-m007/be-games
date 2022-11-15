exports.catchAll = (err, res, req, next) => {
     console.log("Unhandled error: ", err);
     res.sendStatus(500).send({ msg: 'Server error!' });
}

