const chai = require("chai");
const sinon = require("sinon");
const ipModel = require("../../src/models/ip-model");
const ipLimitService = require("../../src/services/ip-limit-service");
const config = require("../../config");
const OverIpLimitError = require("../../src/errors/over-ip-limit-error");
chai.should();

describe("IP limit service test", function() {
	let sandbox;
	beforeEach(function() {
		sandbox = sinon.createSandbox();
		const current = Date.now();
		sandbox.stub(Date, "now").returns(current);
	});
	afterEach(function() {
		sandbox.restore();
	});

	it("should return correctly result, when the count less than max", async function() {
		const mock_obj = {
			"count": 1,
			"reset_time": Date.now() + config.ip_limit.ttl * 1000 
		};
		sandbox.stub(ipModel, "incr").resolves(mock_obj);

		const res = await ipLimitService.incr("192.168.1.1");
		res.should.eql({
			"count": res.count,
			"reset_time": mock_obj.reset_time,
			"ttl": Math.round((mock_obj.reset_time - Date.now())/1000)
		});
	});

	it("should throw OverLimitError, when the count larger than max",async function() {
		const mock_obj = {
			"count": config.ip_limit.max + 1,
			"reset_time": Date.now() + config.ip_limit.ttl * 1000 
		};
		sandbox.stub(ipModel, "incr").resolves(mock_obj);

		try {
			await ipLimitService.incr("192.168.1.1");
		} catch (error) {
			error.constructor.should.eql(OverIpLimitError);
		}
	});
});
