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

  routing.sendPostRequest("attempt-login", data);
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

  routing.sendPostRequest("create-account", data);
};

/**
 * Activate Create A Post Clicked Function
 */
events.createAPostClicked = function() {
  var data = {
    name: document.getElementById("name").value,
    content: document.getElementById("content").value,
  };
  //Need Raul build the Create-Post Web Page that has these:
  // Title, Content
  console.log("clicked");
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
        if (!data.message) {
          alert("Login Failed");
        } else {
          alert(data.message);
        }
      }
      break;

    case "create_account_result":
      if (data.result) {
        alert("Account Creation Successful!");
      } else {
        alert("Account Creation Failed");
      }
      break;

    case "create_post_result":
      if (data.result) {
        alert("Your link has posted successfully.");
      } else {
        if (data.logged_in) {
          alert("Error: Posting failed.");
        } else {
          alert("You must be logged in first!");
        }

      }
  }
};
