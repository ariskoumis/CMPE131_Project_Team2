/**
 * Module dependencies.
 */
var database 				= require('../global/database.js'),
    handler_map 		= {};

/**
 * GET /show-post
 * Show All the Posts in the Database
 */
handler_map.showPost = function(req, res) {
  res.render('post/show-post', {
    data: database.listOfPost,
    currUser: database.currentUser
  });
};

/**
 * Get /new-post
 * Go to New Post Form
 */
handler_map.newPost = function (req, res) {
  res.render('post/new-post', {
    currUser: database.currentUser
  });
};

/**
 * POST /Create-post
 * Allow the User to create a post if and only if he/she is logged in
 * Create a Post Function
 */
handler_map.createPost = function (req, res) {
  var data = req.body;
  var d = new Date();
  var min = 0;

  if(d.getMinutes() > 10){
    min = "";
  }

  var time = d.getHours() + ":" + min + d.getMinutes() + " " + (d.getMonth() + 1) + "/"
    + d.getDate() + "/" + d.getFullYear();

  // Information of the user
  var author = {
    id: database.currentUser.id,
    username: database.currentUser.username
  };

  // A new Post
  var newPost = {
    name: data.name,
    content: data.content,
    author: author,
    timestamp: time,
    comments: []
  };

  // Add The Post to the Database
  if (database.currentUser.existed === true) {
    database.mongoclient.connect(database.url, function (err, client) {
      if (err) throw err;
      var db = client.db("cmpe-it");
      db.collection("posts").insertOne(newPost, function (err, mongo_res) {
        if (err) {
          console.log("err found when insert the post to db.");
          res.redirect("/post/new-post");
        } else {
          database.listOfPost.push(newPost);
          console.log("The Post is in the db");
          res.redirect("/post/show-post");
        }
      });
      client.close();
    });
  } else {
    console.log(database.currentUser);
    console.log("User needs to login first!");
  }
};

module.exports = handler_map;
