
/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
    path 						= require('path'),
    database 				= require('./database.js'),
    Stream 					= new EventEmitter(),
    handler_map 		= {},
    // Add currentUser to know which user is in the system currently
    currentUser     = {},
  // List of Post. Each Post will have a title, content, and author, later on will have comment too, but not right now
    Post            = {};

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

  // If the customer is login, then they cannot attempt to login again
  if (!currentUser) {
    if (data.username === "" || data.password === "") {
      console.log("You're missing one section, please fill all to login.");
      Stream.emit("push", "message", {event: "login_result", result: false});;
    } else {
      database.mongoclient.connect(database.url, function (err, client) {
        if (err) throw err;
        var db = client.db("mydb");
        db.collection("users").findOne({username: data.username}, function (err, res) {
          if (res !== null && res.password === data.password) {
            console.log("User Does Exist, Login successfully ");
            currentUser = {
              id: res._id,
              username: res.username,
              password: res.password
            };
            Stream.emit("push", "message", {event: "login_result", result: true});
          } else {
            console.log("Please enter a correct password");
            Stream.emit("push", "message", {event: "login_result", result: false});
          }
          console.log(currentUser);
          // console.log("Current User is: " + currentUser.username);
        });
        client.close();
      });
    }
  }
};

/**
 * Signup Function
 */
handler_map.createAccountHandler = function (req, res) {
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
  // console.log(req.user);
};

/**
 * Create A Post Function
 */
handler_map.createAPostHandler = function (req, res) {
  var data = req.body;

  // Information of the Post
  var name            = data.name,
      desc            = data.description;

  // Information of the user
  var author          = {
    id: currentUser.id,
    username: currentUser.username
  };

  var newPost   = {
    name: name,
    description: desc,
    author: author
  };

  // Create a new Post and save to the database
  Post.push(newPost, function(err) {
    if (err) {
      console.log(err);
    } else {
      // Need Aris to create a route that lead to the Homepage. HomePage may contains bunch of Posts.
      res.redirect("/");
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
