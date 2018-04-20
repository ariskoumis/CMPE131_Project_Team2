/**
 * Module dependencies.
 */
const events = {};
import routing from "./routing.js";
export default events;

/**
 * Activate Login Clicked Function
 */
events.loginClicked = function() {
  var data = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  routing.sendPostRequest("login", data);
};

/**
 * Activate Signup Clicked Function
 */
events.createAccountClicked = function() {
  var data = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  routing.sendPostRequest("signup", data);
};

/**
 * Activate Create A Post Clicked Function
 */
events.createAPostClicked = function() {
  var data = {
    name: document.getElementById("name").value,
    content: document.getElementById("content").value,
  };
  routing.sendPostRequest("create-post", data);
};


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
};
