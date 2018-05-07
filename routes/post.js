/**
 * Module dependencies.
 */
var database 				= require('../global/database.js'),
    ObjectId        = require('mongodb').ObjectID,
    handler_map 		= {};

/**
 * GET /show-post
 * Show All the Posts in the Database
 */
handler_map.showPost = function(req, res) {
  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    var db = client.db("cmpe-it");
    // Find all the post and convert to a list
    db.collection("posts").find({}).sort({time: -1}).toArray(function (err, allPosts) {
      if (err) throw err;
      res.render('post/show-post', {
        data: allPosts
      });
    });
  })
};

/**
 * Get /new-post
 * Go to New Post Form
 */
handler_map.newPost = function (req, res) {
  res.render('post/new-post');
};

/**
 * POST /Create-post
 * Create a Post Function
 */
handler_map.createPost = function (req, res) {
  var user = req.session.user;
  var data = req.body;
  var d = new Date();
  var min = 0;

  if (d.getMinutes() > 10) {
    min = "";
  }

  var time = d.getHours() + ":" + min + d.getMinutes() + ", " + (d.getMonth() + 1) + "/"
    + d.getDate() + "/" + d.getFullYear();

  // Information of the user
  var author = {
    id: user._id,
    username: user.username
  };

  var impressions = {
    likes: 0,
    dislikes: 0
  };

  // A new Post
  var newPost = {
    name: data.name,
    content: data.content,
    author: author,
    timestamp: time,
    time: d.getTime(),
    comments: [],
    likes: impressions.likes,
    dislikes: impressions.dislikes,
    likedUser: [],
    dislikedUser: []
  };

  // Add The Post to the Database
  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    var db = client.db("cmpe-it");
    db.collection("posts").insertOne(newPost, function (err) {
      if (err) {
        console.log("err found when insert the post to db.");
        res.redirect("/post/new-post");
      } else {
        console.log("The Post is in the db");
        res.redirect("/post/show-post");
      }
    });
    client.close();
  });
};

/**
 * Post /like
 * Like a post
 */
handler_map.likePost = function (req, res) {
  database.mongoclient.connect(database.url, function (err, client) {
    var foundInLike = false;
    var foundInDislike = false;
    if (err) throw err;
    var db = client.db("cmpe-it");

    db.collection('posts').findOne({_id: new ObjectId(req.params.id)}, function(err, foundPost) {
      if (err) throw err;
      // Check if user already like the post. If they like, then, decrement the like.
      foundPost.likedUser.forEach(function (username) {
        if (username === req.session.user.username) {
          db.collection('posts').update({"_id": new ObjectId(req.params.id)}, {
            $inc: {
              likes: -1
            }, $pull: {
              likedUser: req.session.user.username
            }
          });
          foundInLike = true;
        }
      });

      foundPost.dislikedUser.forEach(function (username) {
        if (username === req.session.user.username) {
          foundInDislike = true;
        }
      });

      // Check if The user is already hit Dislike for that post.
      // If they already hit Dislike, Decrement dislike and increment Like.
      if (!foundInLike) {
        if (!foundInDislike) {
          db.collection('posts').update({"_id": new ObjectId(req.params.id)}, {
            $inc: {
              likes: 1
            }, $push: {
              likedUser: req.session.user.username
            }
          });
        } else {
          db.collection('posts').update({"_id": new ObjectId(req.params.id)}, {
            $inc: {
              dislikes: -1,
              likes: 1
            }, $pull: {
              dislikedUser: req.session.user.username
            }, $push: {
              likedUser: req.session.user.username
            }
          });
        }
      }
      res.redirect('/post/show-post');
    });
  });
};

/**
 * Post /like
 * Dislike a post
 */
handler_map.dislikePost = function (req, res) {
  database.mongoclient.connect(database.url, function (err, client) {
    var foundInLike = false;
    var foundInDislike = false;
    if (err) throw err;
    var db = client.db("cmpe-it");
    db.collection('posts').findOne({_id: new ObjectId(req.params.id)}, function(err, foundPost) {
      if (err) throw err;
      // Check if user already dislike the post. If they dislike, then, decrement the dislike.
      foundPost.dislikedUser.forEach(function (username) {
        if (username === req.session.user.username) {
          db.collection('posts').update({"_id": new ObjectId(req.params.id)}, {
            $inc: {
              dislikes: -1
            }, $pull: {
              dislikedUser: req.session.user.username
            }
          });
          foundInDislike = true;
        }
      });

      foundPost.likedUser.forEach(function (username) {
        if (username === req.session.user.username) {
          foundInLike = true;
        }
      });

      // Check if The user is already hit Dislike for that post.
      // If they already hit Dislike, Decrement dislike and increment Like.
      if (!foundInDislike) {
        if (!foundInLike) {
          db.collection('posts').update({"_id": new ObjectId(req.params.id)}, {
            $inc: {
              dislikes: 1
            }, $push: {
              dislikedUser: req.session.user.username
            }
          });
        } else {
          db.collection('posts').update({"_id": new ObjectId(req.params.id)}, {
            $inc: {
              likes: -1,
              dislikes: 1
            }, $pull: {
              likedUser: req.session.user.username
            }, $push: {
              dislikedUser: req.session.user.username
            }
          });
        }
      }
      res.redirect('/post/show-post');
    });
  });
};

/**
 * Delete /delete-post
 * Delete a Post from a Database
 */
handler_map.deletePost = function (req, res) {
  database.mongoclient.connect(database.url, function(err, client) {
    if (err) throw err;
    var db = client.db("cmpe-it");
    db.collection('posts').remove({"_id": new ObjectId(req.params.id)}, function(err) {
      if (err) throw err;
      res.redirect('/post/show-post')
    });
    client.close();
  });
};

module.exports = handler_map;
