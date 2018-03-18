const handler_map = {};


handler_map.root_handler = function(req, res) {
	res.sendFile('index.html', function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("we good.")
		}
	});
}

//export
module.exports = handler_map;