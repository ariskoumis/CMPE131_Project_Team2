const events = {};
const routing = require("./routing.js");

events.testDBClicked = function() {
	var data = {
		username: document.getElementById("username").value,
		password: document.getElementById("password").value
	};

	routing.sendPostRequest("testDB", data);
}

module.exports = events;