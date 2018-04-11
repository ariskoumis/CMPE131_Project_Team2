const events = {};
import routing from "./routing.js";
// const routing = require("./routing.js");

export default events;

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

events.SSEReceived = function(data) {
	console.log(data);
}