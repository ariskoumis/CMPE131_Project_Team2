/**
 * Module dependencies.
 */
var EventEmitter 		= require('events'),
    database 				= require('../global/database.js'),
    Stream 					= new EventEmitter(),
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
 */
handler_map.createNewComment = function(req, res) {

  var d = new Date();
  var min = 0;

  if(d.getMinutes() > 10){
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


  database.mongoclient.connect(database.url, function(err, client) {
    if (err) throw err;
    var db = client.db("cmpe-it");
    db.collection("posts").findOne({_id: req.params.id}, function (err, foundPost) {
      if (err) throw err;
      else {
        console.log("go here 1");
        db.collection("comments").insertOne(newComment, function (err, comment) {
          if (err) throw err;
          else {
            console.log("go here 2");
            res.redirect('/post/show-post');
            foundPost.comment.push(comment);
          }
        })
      }
    })
  });
};

/**
 * Get Comment Edit Form
 */
handler_map.getEditComment = function(req, res) {
  res.render('comment/edit-comment');
};

/**
 * Post Create a new Comment for a post
 */


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
