/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
    database 				= require('../global/database.js'),
    Stream 					= new EventEmitter(),
    handler_map 		= {};

/**
 * Get /
 * HomePage
 */
handler_map.rootHandler = function (req, res) {
<<<<<<< HEAD
  res.render('login');
=======
  res.render('index' , {currentUser: database.currentUser});
};

/**
 * Post /login
 */
handler_map.login = function (req) {
  var data = req.body;
  if (database.currentUser.existed === false) {
    if (data.username === "" || data.password === "") {
      Stream.emit("push", "message", {event: "login_result", result: false, message: "You're missing one section, please fill all to login."});
    } else {
      database.mongoclient.connect(database.url, function (err, client) {
        if (err) throw err;
        var db = client.db("mydb");
        db.collection("users").findOne({username: data.username}, function (err, res) {
          if (res !== null && res.password === data.password) {
            console.log("User Does Exist, Login successfully ");
            database.currentUser = {
              id: res._id,
              username: res.username,
              password: res.password,
              existed: true
            };
            console.log(database.currentUser);
            Stream.emit("push", "message", {event: "login_result", result: true});
          } else {
            console.log("Please enter a correct password");
            Stream.emit("push", "message", {event: "login_result", result: false});
          }
        });
        client.close();
      });
    }
  } else {
    Stream.emit("push", "message", {event: "login_result", result: false});
    console.log("You're already logged in!");
  }
};

/**
 * Post /Signup
 */
handler_map.signup = function (req) {
  var data = req.body;
  // database.signup("users", data);
  if (data.username === "" || data.password === "" || data.email === "") {
    console.log("You're missing one section, please fill all to signup.");
    Stream.emit("push", "message", {event: "create_account_result", result: false});
  } else {
    //Write to data to collection titled 'users'
    database.mongoclient.connect(database.url, function (err, client) {
      if (err) throw err;
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
    });
  }
};

/**
 * GET /logout
 * Log out.
 */
handler_map.logout = function(req, res) {
  database.currentUser = {
    existed: false
  };
  res.redirect("/");
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
