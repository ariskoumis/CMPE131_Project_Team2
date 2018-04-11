var EventEmitter = require('events');

var handler_map = {};
var path = require('path');
var database = require('./database.js');
const Stream = new EventEmitter();

handler_map.rootHandler = function(req, res) {
	res.set("Content-Type", "text/html");
	res.sendFile(path.resolve(__dirname + '/../public/index.html'), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("we good.")
		}
	});
}

handler_map.attemptLoginHandler = function(req, res) {
	var data = req.body;
	console.log("attempt login");

	Stream.emit("push", "message", { event: "login_result", result: true});
}

handler_map.createAccountHandler = function(req, res) {
	var data = req.body;
	console.log("create user");

	Stream.emit("push", "message", { event: "create_account_result", result: true});

	//Write to data to collection titled 'users'
	// database.write("users", data);
}

handler_map.initializeSSEHandler = function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});

	Stream.on("push", function(event, data) {
		res.write("event: " + String(event) + "\n" + "data: " + JSON.stringify(data) + "\n\n");
	});
}

//export
module.exports = handler_map;