const events = {};
const routing = require("./routing.js");

events.testDBClicked = function() {
	routing.sendPostRequest("testDB", {});
}

module.exports = events;