
/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
  path 						= require('path'),
  database 				= require('./database.js'),
  Stream 					= new EventEmitter(),
  handler_map 		= {},
  // Add currentUser to know which user is in the system currently
  currentUser     = {
    existed: false
  };

/**
 * Get HomePage
 */
handler_map.rootHandler = function (req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname + '/../public/index.html'), function (err) {
    if (err) {
      console.log(err);
    } else {
      // console.log("we good.")
    }
  });
};

/**
 * Get Create-Post Form
 */
handler_map.getPostForm = function (req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname + '/../public/post/new-post.html'));
};

/**
 * Show All the Posts
 */
handler_map.showPost = function (req, res) {
  res.set("Content-Type", "text/html");
  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    let db = client.db("mydb");

    // Find all the Post and put it to posts
    db.collection("posts").find({}, function (err, allPosts) {
      if (err) throw err;
      else {
        res.sendFile(path.resolve(__dirname + '/../public/post/show-post.html'), {posts: allPosts});
      }
    });
    client.close();
  })
};

/**
 * Login Function
 */
handler_map.attemptLoginHandler = function (req) {
  var data = req.body;
  if (currentUser.existed === false) {
    if (data.username === "" || data.password === "") {
      Stream.emit("push", "message", {event: "login_result", result: false, message: "You're missing one section, please fill all to login."});
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
              password: res.password,
              existed: true
            };
            console.log(currentUser);
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
    console.log("You're already logged in!");
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
 * Allow the User to create a post if and only if he/she is logged in
 */
handler_map.createAPostHandler = function (req, res) {
  var data = req.body;

  // Information of the Post
  var name                = data.name,
      content             = data.content;

  // Information of the user
  var author          = {
    id: currentUser.id,
    username: currentUser.username
  };

  // A new Post
  var newPost   = {
    name: name,
    content: content,
    author: author
  };

  // Add The Post to the Database
  if (currentUser.existed === true) {
    database.mongoclient.connect(database.url, function (err, client) {
      if (err) throw err;
      var db = client.db("mydb");
      //second parameter of following callback function is typically called res, but I changed it to mongo_res to avoid losing node.js's res parameter.
      db.collection("posts").insertOne(newPost, function (err, mongo_res) {
        if (err) {
          console.log("err found when insert the post to db.");
          Stream.emit("push", "message", {event: "create_post_result", result: false});
          throw err;
        } else {
          Stream.emit("push", "message", {event: "create_post_result", result: true});
          console.log("The Post is in the db");
        }
      });
      client.close();
    });
  } else {
    Stream.emit("push", "message", {event: "create_post_result", result: false, logged_in: 0});
  }
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
