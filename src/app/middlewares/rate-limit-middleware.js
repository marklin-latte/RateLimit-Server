const ipService = require("../../services/ip-limit-service");

module.exports = async (req, res, next) => {
	try {
		const res = await ipService.incr(req.ip);
		req.user = {
			ip: req.ip,
			count: res.count,
			ttl: res.ttl 
		};
		next();
	} catch (error) {
		next(error);
	}
};
