module.exports = {
	"server":{
		"port": process.env.SERVER_PORT || 3000
	},
	"redis": {
		"host": process.env.REDIS_HOST || "127.0.0.1",
		"port": process.env.REDIS_PORT || 32768,
		"prefix": "api",
	},
	"ip_limit": {
		"ttl": 60,
		"max": 10
	}
};