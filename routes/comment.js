/**
 * Module dependencies.
 */
var database 				= require('../global/database.js'),
    ObjectId        = require('mongodb').ObjectID,
    async           = require('async'),
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
handler_map.createNewComment = function(req, res, next) {
  var user = req.session.user;
  var temp = false;
  var foundPost;

  var author = {
    id: user._id,
    username: user.username
  };

  // New Comment
  var newComment = {
    author: author,
    content: req.body.content,
    postId: req.params.id
  };

  async.waterfall([
    function (done) {
    // Find the Post in the database. If the post is existed, then pass that post to the next function
      database.mongoclient.connect(database.url, function (err, client) {
        if (err) throw err;
        var db = client.db("cmpe-it");
        db.collection("posts").findOne({"_id": new ObjectId(req.params.id)}, function (err, post) {
          if (err) throw err;
          done(err, post);
        });
        client.close();
      });
    },
    // Insert the newComment
    function(post, done) {
      database.mongoclient.connect(database.url, function (err, client) {
        if (err) throw err;
        var db = client.db("cmpe-it");
        db.collection("comments").insertOne(newComment);
        db.collection("comments").findOne({"_id": new ObjectId(newComment._id)}, function (err, comment) {
          if (err) throw err;
          done(err, post, comment);
        });
        client.close();
      });
    },
    function(post, comment, done) {
      database.mongoclient.connect(database.url, function (err, client) {
        if (err) throw err;
        var db = client.db("cmpe-it");
        db.collection('posts').update({"_id": new ObjectId(post._id)}, {
          $push: {
            "comments": comment
          }
        });
        done(err, 'adding comment into comments collection and add that comment into comments list of that post');
        client.close();
      });

    }
    ],
    function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/post/show-post');
    });
};

module.exports = handler_map;
