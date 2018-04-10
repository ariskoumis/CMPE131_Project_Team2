const events = {};
const routing = require("./routing.js");

events.loginClicked = function() {
	var data = {
		username: document.getElementById("username").value,
		password: document.getElementById("password").value
	};

	routing.sendPostRequest("attempt-login", data);
}

events.createAccountClicked = function() {
	var data = {
		username: document.getElementById("username").value,
		password: document.getElementById("password").value
	};

	routing.sendPostRequest("create-account", data);
}



module.exports = events;