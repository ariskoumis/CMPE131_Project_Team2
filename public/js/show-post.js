import routing from "./routing.js";
import events  from "./event_handlers.js";

/**
 * Main function when page is loaded. Everything starts from here.
 */
function main() {
  attachButtonListner("show-post", events.showAllPost);
  routing.setupSSE();
}

function attachButtonListner(button_id, listener) {
  document.getElementById(button_id).addEventListener("click", listener);
}

//Only run the main function when all the HTML elements on the page have rendered
document.addEventListener('DOMContentLoaded', main);
