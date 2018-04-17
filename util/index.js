/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
    path 						= require('path'),
    database 				= require('./database.js'),
    Stream 					= new EventEmitter(),
    passport        = require("passport"),
    User            = require("../models/user"),
    handler_map 		= {
      currentUser: {
        existed: false
      }
    };


handler_map.getCurrentUser = function() {
  return handler_map.currentUser;
};

/**
 * Get HomePage
 */
handler_map.rootHandler = function (req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname + '/../public/index.html'));
};




/**
 * Login Function
 */
handler_map.attemptLoginHandler = function (req) {
  console.log("checking");
  passport.authenticate('local'),
    function (req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      // res.redirect('/users/' + req.user.username);
      console.log("success");
    }
};




  // var data = req.body;
  // if (handler_map.currentUser.existed === false) {
  //   if (data.username === "" || data.password === "") {
  //     Stream.emit("push", "message", {event: "login_result", result: false, message: "You're missing one section, please fill all to login."});
  //   } else {
  //     database.mongoclient.connect(database.url, function (err, client) {
  //       if (err) throw err;
  //       var db = client.db("mydb");
  //       db.collection("users").findOne({username: data.username}, function (err, res) {
  //         if (res !== null && res.password === data.password) {
  //           console.log("User Does Exist, Login successfully ");
  //           handler_map.currentUser = {
  //             id: res._id,
  //             username: res.username,
  //             password: res.password,
  //             existed: true
  //           };
  //           console.log(handler_map.currentUser);
  //           Stream.emit("push", "message", {event: "login_result", result: true});
  //         } else {
  //           console.log("Please enter a correct password");
  //           Stream.emit("push", "message", {event: "login_result", result: false});
  //         }
  //       });
  //       client.close();
  //     });
  //   }
  // } else {
  //   console.log("You're already logged in!");
  // }
// };

/**
 * Signup Function
 */
handler_map.createAccountHandler = function (req) {

  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    console.log("tesing");
    if(err) {
      console.log("Fail register");
      // req.flash("error", err.message);
      // return res.render("register");
    } else {
      passport.authenticate("local")(req, res, function(){
        console.log("success register");
        // req.flash("success", "Welcome to YelpCamp " + user.username);
        // res.redirect("/campgrounds");
      })
    }
  });
  // var data = req.body;
  // // database.signup("users", data);
  // if (data.username === "" || data.password === "" || data.email === "") {
  //   console.log("You're missing one section, please fill all to signup.");
  //   Stream.emit("push", "message", {event: "create_account_result", result: false});
  // } else {
  //   //Write to data to collection titled 'users'
  //   database.mongoclient.connect(database.url, function (err, client) {
  //     if (err) throw err;
  //     var db = client.db("mydb");
  //     db.collection("users").findOne({username: data.username}, function (err, res) {
  //       if (res !== null) {
  //         console.log("User does Exist, please enter a different username");
  //         Stream.emit("push", "message", {event: "create_account_result", result: false});
  //       } else {
  //         console.log("Congratulation, you just create an account");
  //         db.collection("users").insertOne(data);
  //         Stream.emit("push", "message", {event: "create_account_result", result: true});
  //       }
  //       client.close();
  //     })
  //   });
  // }
  // // console.log(req.user);
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
