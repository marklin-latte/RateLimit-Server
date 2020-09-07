
const config = require("../../config");
const OverLimitError = require("../errors/over-ip-limit-error");
const ipModel = require("../models/ip-model");

/**
 * @typedef {Object} Service.User_IP_Status 
 * @property {Number} count 
 * @property {Number} reset_time  
 * @property {Number} ttl
 */

module.exports = {
	/**
     * @param {String} ip
     * @returns {Promise<Service.User_IP_Status>} 
     * @throws {OverLimitError}
     */
	incr : async (ip) => {
		const res = await ipModel.incr(ip);
		const ttl = Math.round((res.reset_time - Date.now())/1000);
		if(res.count > config.ip_limit.max){
			throw new OverLimitError(`To many request ! Please wait ${ttl} sec`);
		}

		return {
			"count": res.count,
			"reset_time": res.reset_time,
			"ttl": ttl 
		};
	},
};