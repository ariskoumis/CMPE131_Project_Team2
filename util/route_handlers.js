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

handler_map.testDBHandler = function(req, res) {

	// extract data from POST request
	var data = (req.body);

	//Write to data to collection titled 'users'
	database.write("users", data);
};

//export
module.exports = handler_map;