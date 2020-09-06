class OverIpLimitError extends Error {
	constructor(message){
		super(message);
		this.name = this.constructor.name;
		this.httpCode = 429;
	}
}

module.exports = OverIpLimitError;