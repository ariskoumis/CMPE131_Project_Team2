const handler_map = {};
const path = require('path');

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

handler_map.homeHandler = function(req, res) {
	res.set("Content-Type", "text/html");
	res.sendFile(path.resolve(__dirname + '/../public/test.html'), function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("we good.")
		}
	});
};

//export
module.exports = handler_map;