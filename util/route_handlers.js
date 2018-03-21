const handler_map = {};


handler_map.root_handler = function(req, res) {
	res.render('home', function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("we good.")
		}
	});
};

//export
module.exports = handler_map;
