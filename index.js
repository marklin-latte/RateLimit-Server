const config = require("./config");
const app = require("./src/app/server");

app.listen(config.server.port, () => {
	console.log("Server started !");
});