(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
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
},{"./routing.js":3}],2:[function(require,module,exports){
const events = require("./event_handlers.js");
const routing = require("./routing.js");

/**
 * Function: attachButtonListener
 * Description: make a function occur whenever a button is clicked. Similar to 'buttonClicked()' in HTML code
 * 
 * Parameter: button_id
 * Type: string
 * Description: The ID of the button
 * 
 * Parameter: listner
 * Type: function
 * Description: The function you want to run whenever the button is pressed 
 * 
 */
function attachButtonListner(button_id, listener) {
    document.getElementById(button_id).addEventListener("click", listener);
}

/**
 * Main function when page is loaded. Everything starts from here.
 */
function main() {
    attachButtonListner("login", events.loginClicked);
    attachButtonListner("create-account", events.createAccountClicked);
    // .addEventListener('click', events.testDBClicked);
    
}


//Only run the main function when all the HTML elements on the page have rendered
document.addEventListener('DOMContentLoaded', main);
},{"./event_handlers.js":1,"./routing.js":3}],3:[function(require,module,exports){
const routing = {};

/**
 * Function sendPostrequest
 * Description: Function to send post request to server
 * 
 * Parameter: endpoint
 * Type: string
 * Description: endpoint that you want to send data to.
 * Example: "/createDatabase" if there is an endpoint on the server to create a databse
 * 
 * 
 * Parameter data
 * Type: Object
 * Description: Any parameters, or additional data you want to send to endpoint. By default is empty
 */
routing.sendPostRequest = function(endpoint, data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:8000/"+endpoint, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    //Check if data was passed to function, if not, add empty object
    if (data) {
        xhr.send(JSON.stringify(data));
    }
    else {
        xhr.send();
    }
    
}

module.exports = routing;
},{}]},{},[2]);
