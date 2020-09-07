const redis = require("redis");
const config = require("../../config");

module.exports = {
	getClient(){
		return redis.createClient(config.redis);
	}
};