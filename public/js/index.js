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