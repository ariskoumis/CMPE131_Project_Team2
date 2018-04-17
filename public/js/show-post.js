// import database from "../../global/database.js";
import routing from "./routing.js";

const database = require('../../global/database.js');
var listOfPost      = [];

/**
 * Main function when page is loaded. Everything starts from here.
 */
function main() {
  // attachButtonListner("task-submit", submitButtonClicked());
  routing.setupSSE();
}

function attachButtonListner(button_id, listener) {
  document.getElementById(button_id).addEventListener("click", listener);
}

function submitButtonClicked(){
  getListOfPosts();
  renderList();
}

/**
 * Show All the Posts
 */
function getListOfPosts() {
  // database.mongoclient.connect(database.url, function (err, client) {
  //   if (err) throw err;
  //   let db = client.db("mydb");
  //   db.collection("posts").find().forEach(function(data) {
  //     listOfPost.push(data);
  //   });
  //   client.close();
  // });
}


function renderList(){
  //clear current contents of tasks div
  // var element;
  // document.getElementById("tasks").innerHTML = "";
  //
  // for (var i = 0; i < listOfPost.length; i++) {
  //   var div_open = '<div id="task${i}">';
  //   var task_name = '<span id="task${i}-name">${listOfPost[i]}</span>';
  //   var close = '</div>';
  //
  //   //combine variables
  //   element = div_open + task_name + close;
  //   //inject HTML into task-list div
  //   document.getElementById("tasks").innerHTML += element;
  // }
}


//Only run the main function when all the HTML elements on the page have rendered
document.addEventListener('DOMContentLoaded', main);
