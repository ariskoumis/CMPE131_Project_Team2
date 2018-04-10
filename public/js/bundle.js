(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
const events = {};

events.testDBClicked = function() {
	console.log("hey!");
}

module.exports = events;
},{}],2:[function(require,module,exports){
const events = require("./event_handlers.js");

/**
 * Main function when page is loaded. Everything starts from here.
 */
function main() {
    document.getElementById("test-DB").addEventListener("click", events.testDBClicked);
    // .addEventListener('click', events.testDBClicked);
    
}


//Only run the main function when all the HTML elements on the page have rendered
document.addEventListener('DOMContentLoaded', main);
},{"./event_handlers.js":1}]},{},[2]);
