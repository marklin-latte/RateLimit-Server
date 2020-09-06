// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
	if(!err.httpCode) err.httpCode = 500;
	res.status(err.httpCode).send({ error: err.message });
};