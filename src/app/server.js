const express = require("express");
const rateLimitMiddleware = require("./middlewares/rate-limit-middleware");
const errorHandlerMiddleware = require("./middlewares/error-handler-middleware");
const app = express();

app.use(rateLimitMiddleware);
app.use(errorHandlerMiddleware);
app.get("/status", (req, res) => {
	res.send(req.user);
});

module.exports = app;