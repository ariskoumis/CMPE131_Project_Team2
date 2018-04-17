/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
    path 						= require('path'),
    database 				= require('./database.js'),
    User            = require('./index.js').getCurrentUser(),
    Stream 					= new EventEmitter(),
    handler_map 		= {};

/**
 * Show All the Posts in the Database
 */
handler_map.showPost = function(req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname + '/../public/post/show-post.html'));
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
function getListOfPosts() {
  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    let db = client.db("mydb");
    db.collection("posts").find().forEach(function(data) {
      listOfPost.push(data);
    });
    client.close();
  });
}

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
    id: User.id,
    username: User.username
  };

  // A new Post
  var newPost   = {
    name: name,
    content: content,
    author: author
  };

  console.log(User);
  // Add The Post to the Database
  if (User.existed === true) {
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
    console.log("fail");
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
