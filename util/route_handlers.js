var handler_map = {};
var path = require('path');
var database = require('./database.js');

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
}

handler_map.createAccountHandler = function(req, res) {
	var data = req.body;
	console.log("create user");

	//Write to data to collection titled 'users'
	// database.write("users", data);
}

//export
module.exports = handler_map;