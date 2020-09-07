const config =  require("../../config");
const {getClient} = require("./connect");
const KEY = `${config.redis.prefix}:ips`; 
const fs = require("fs"); 

/**
 * @typedef {Object} Model.User_IP_Status 
 * @property {Number} count 
 * @property {Number} reset_time  
 */

module.exports = {
	/**
     * @param {String} ip
     * @returns {Promise<Model.User_IP_Status>}
     */
	incr : (ip) => {
		const key = `${KEY}:${ip}`;
		return new Promise((resolve, reject) => {
			const client = getClient();
			client.eval(fs.readFileSync(__dirname + "/lurs/ip-incr.lua"), 1, 
				key, 
				config.ip_limit.max, 
				config.ip_limit.ttl, 
				Date.now(), 
				(err, replay) => {
					if(err) reject(err);
					resolve({
						"count": replay[0],
						"reset_time": replay[1]
					});
				});
		});
	}
};