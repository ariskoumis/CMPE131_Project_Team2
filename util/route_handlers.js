const handler_map = {};
const path = require('path');


<<<<<<< HEAD
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
=======
handler_map.root_handler = function(req, res) {
	res.render('home', function(err) {
>>>>>>> 1aeca987e0ecf0e2dffb260f97881a971553fe80
		if (err) {
			console.log(err);
		} else {
			console.log("we good.")
		}
	});
};

//export
module.exports = handler_map;
