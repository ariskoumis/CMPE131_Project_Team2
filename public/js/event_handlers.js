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
	//exit function if data doesn't have event property
	if (!data.hasOwnProperty('event')) {
		return;
	}

	switch(data.event) {

		case "login_result":
			if (data.result) {
				alert("Login Successful!");
			} else {
				alert("Login Failed");
			}
			break;

		case "create_account_result":
			if (data.result) {
				alert("Account Creation Successful!");
			} else {
				alert("Account Creation Failed");
			}
			break;
	}


}