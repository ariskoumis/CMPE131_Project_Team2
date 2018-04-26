/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
    database 				= require('../global/database.js'),
    Stream 					= new EventEmitter(),
    ObjectId        = require('mongodb').ObjectID,
    handler_map 		= {};

/**
 * Get Comment New Form
 */
handler_map.getNewComment = function(req, res) {
  res.render('comment/new-comment', {
    postId: req.params.id
  });
};

/**
 * Post Create a new Comment for a post
 * Comments are stored in Post database. Each post has a list of comments
 */
handler_map.createNewComment = function(req, res) {

  var d = new Date();
  var min = 0;

  if (d.getMinutes() > 10) {
    min = "";
  }

  var time = d.getHours() + ":" + min + d.getMinutes() + " " + (d.getMonth() + 1) + "/"
    + d.getDate() + "/" + d.getFullYear();

  var author = {
    id: database.currentUser.id,
    username: database.currentUser.username
  };

  // New Comment
  var newComment = {
    author: author,
    content: req.body.content,
    postId: req.params.id,
    timestamp: time
  };

  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    var db = client.db("cmpe-it");
    if (database.currentUser.existed === true) {
      db.collection('posts').update({"_id": new ObjectId(req.params.id)}, {$push: {"comments": newComment}}, function (err) {
        if (err) throw err;
        else {

          database.listOfPost.forEach(function(post) {
            var res = post._id.toString().valueOf();
            if (res === req.params.id.valueOf()) {
              post.comments.push(newComment);
            }
          });
          res.redirect('/post/show-post');
        }
      });
    } else {
      console.log("User needs to login first!");
      res.redirect('/');
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
