/**
 * Module dependencies.
 */
var database 				= require('../global/database.js'),
    handler_map 		= {};

/**
 * Get /
 * HomePage
 */
handler_map.rootHandler = function (req, res) {
  res.render('index' , { currentUser: database.currentUser });
};

/**
 * Get /
 * signup
 */
handler_map.getSignup = function (req, res) {
  res.render('signup');
};

/**
 * Post /login
 */
handler_map.login = function (req, res) {
  var data = req.body;
  if (database.currentUser.existed === false) {
    if (data.username === "" || data.password === "") {
      console.log("One of the box is missing");
    } else {
      database.mongoclient.connect(database.url, function(err, client) {
        if (err) throw err;
        var db = client.db("cmpe-it");
        db.collection("users").findOne({username: data.username}, function (err, mongores) {
          if (mongores !== null && mongores.password === data.password) {
            console.log("User Does Exist, Login successfully ");
            database.currentUser = {
              id: mongores._id,
              username: mongores.username,
              password: mongores.password,
              existed: true
            };
            res.redirect("/post/show-post");
          } else {
            console.log("Please enter a correct password");
            res.redirect("/");
          }
        });
        client.close();
      });
    }
  } else {
    res.redirect("/post/show-post");
    console.log("You're already logged in!");
  }
};

/**
 * Post /Signup
 */
handler_map.postSignup = function (req, res) {
  var data = req.body;
  if (data.username === "" || data.password === "" || data.email === "") {
    console.log("You're missing one section, please fill all to signup.");
  } else {
    //Write to data to collection titled 'users'
    database.mongoclient.connect(database.url, function(err, client) {
      if (err) throw err;
      var db = client.db("cmpe-it");
      db.collection("users").findOne({username: data.username}, function (err, mongoRes) {
        if (mongoRes !== null) {
          console.log("User does Exist, please enter a different username");
          res.redirect("/signup");
        } else {
          console.log("Congratulation, you just create an account");
          client.db("cmpe-it").collection("users").insertOne(data);
        }
        client.close();
      })
    });
  }
};

/**
 * POST /logout
 * Log out.
 */
handler_map.logout = function(req, res) {
  database.currentUser = {
    existed: false
  };
  res.redirect("/");
};

module.exports = handler_map;
