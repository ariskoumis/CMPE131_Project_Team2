/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
  path 						= require('path'),
  database 				= require('./database.js'),
  Stream 					= new EventEmitter(),
  handler_map 		= {};

/**
 * Get HomePage
 */
handler_map.rootHandler = function (req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname + '/../public/index.html'), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("we good.")
    }
  });
};

/**
 * Login Function
 */
handler_map.attemptLoginHandler = function (req) {
  var data = req.body;

  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    if (data.username === "" | data.password === "") {
      console.log("You're missing one section, please fill all to login.");
      Stream.emit("push", "message", {event: "login_result", result: false});
    } else {
      var db = client.db("mydb");
      db.collection("users").findOne({username: data.username}, function (err, res) {
        if (res !== null && res.password === data.password) {
          console.log("User Does Exist, Loggin successfully");
          Stream.emit("push", "message", {event: "login_result", result: true});
        } else {
          console.log("Please enter a correct password");
          Stream.emit("push", "message", {event: "login_result", result: false});
        }
        client.close();
      })
    }
  });
};

/**
 * Signup Function
 */
handler_map.createAccountHandler = function (req, res) {
  var data = req.body;
  // database.signup("users", data);
  //Write to data to collection titled 'users'
  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    if (data.username === "" | data.password === "" | data.email === "") {
      console.log("You're missing one section, please fill all to signup.");
      Stream.emit("push", "message", {event: "create_account_result", result: false});
    } else {
      var db = client.db("mydb");
      db.collection("users").findOne({username: data.username}, function (err, res) {
        if (res !== null) {
          console.log("User does Exist, please enter a different username");
          Stream.emit("push", "message", {event: "create_account_result", result: false});
        } else {
          console.log("Congratulation, you just create an account");
          db.collection("users").insertOne(data);
          Stream.emit("push", "message", {event: "create_account_result", result: true});
        }
        client.close();
      })
    }
  });
};

/**
 * Initialize SSE Handler
 */
handler_map.initializeSSEHandler = function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  Stream.on("push", function (event, data) {
    res.write("event: " + String(event) + "\n" + "data: " + JSON.stringify(data) + "\n\n");
  });
};

module.exports = handler_map;
