/* eslint-disable mocha/no-hooks-for-single-case */
const chai = require("chai");
const supertest = require("supertest");
const config = require("../../config");
const redis = require("redis");
const server = require("../../src/app/server");
server.enable("trust proxy");

chai.should();

describe("IP Limit Test", function() {
	const IP = "192.168.1.1";
	let request;
	let client;
	let server_;
	before(function() {
		server_ = server.listen(config.server.port);
		request = supertest(server_);
		client = redis.createClient(config.redis);
	});

	afterEach(function() {
		return new Promise((resolve, reject) => {
			client.flushdb( function (err, succeeded) {
				if(err) reject(err);
				resolve(succeeded);
			});
		});
	});

	after(async function() {
		await server_.close();
	});

	context("The client did not do anything", function() {
		it("should return 2 times, when the client performes 2 times request", async function() {
			const res = await sendMultiRequest(request,"/status", 2); 
			res[0].status.should.eql(200);
			res[1].status.should.eql(200);
			res[0].body.count.should.eql(1);
			res[1].body.count.should.eql(2);
		});
	});
	context("The client had performed max times in a minutes", function() {
		before(async function() {
			const overTimes = config.ip_limit.max + 1;
			const reset_time = Date.now() + 10000;
			await generateData(client, IP, overTimes, reset_time); 
		});
		it("should return error, when the client executes 1 times in the minutes", async function() {
			const res = await request.get("/status").set("X-Forwarded-For", IP);
			res.status.should.eql(429);
		});
	});
	context("The client had performed max times request at 61 sec ago", function() {
		before(async function() {
			const overTimes = config.ip_limit.max + 1;
			const reset_time = Date.now() - 1000;
			await generateData(client, IP, overTimes, reset_time); 
		});
		it("should return 1 times, when the client perform 1 times request", async function() {
			const res = await request.get("/status").set("X-Forwarded-For", IP);
			res.status.should.eql(200);
			res.body.count.should.eql(1);
		});
	});
});

function sendMultiRequest(request,url, times){
	let tasks = (new Array(times)).fill(1);
	tasks = tasks.map(() => {
		return request.get(url);
	});
	return Promise.all(tasks);
}

function generateData(client, ip, count, reset_time){
	const key = `${config.redis.prefix}:ips:${ip}`;
	return new Promise((resolve, reject) => {
		client.hmset(key, "count", count, "reset_time", reset_time,(err, replay) => {
			if(err) reject(err);
			resolve(replay);
		});
	});
}