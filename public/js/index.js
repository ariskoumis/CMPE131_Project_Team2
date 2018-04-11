import events  from "./event_handlers.js";
import routing from "./routing.js";

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

    routing.setupSSE();
}


//Only run the main function when all the HTML elements on the page have rendered
document.addEventListener('DOMContentLoaded', main);