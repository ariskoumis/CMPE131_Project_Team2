/**
 * Module dependencies.
 */
var database 				= require('../global/database.js'),
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
  var user = req.session.user;

  var author = {
    id: user.id,
    username: user.username
  };

  // New Comment
  var newComment = {
    author: author,
    content: req.body.content,
    postId: req.params.id
  };

  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    var db = client.db("cmpe-it");
    db.collection('posts').update({"_id": new ObjectId(req.params.id)}, {$push: {
      "comments": newComment
    }}, function (err) {
      if (err) throw err;
      res.redirect('/post/show-post');
    });
  });
};

module.exports = handler_map;
