/**
 * Module dependencies.
 */
var database 				= require('../global/database.js'),
    async           = require('async'),
    crypto          = require('crypto'),
    nodemailer      = require('nodemailer'),
    handler_map 		= {};

/**
 * Get /
 * HomePage
 */
handler_map.rootHandler = function (req, res) {
  res.render('index');
};

/**
 * Post /login
 */
handler_map.login = function (req, res) {
  var data = req.body;
  if (!req.session.user) {
    if (data.username === "" || data.password === "") {
      console.log("One of the box is missing");
    } else {
      database.mongoclient.connect(database.url, function(err, client) {
        if (err) throw err;
        var db = client.db("cmpe-it");
        db.collection("users").findOne({username: data.username}, function (err, user) {
          if (user) {
            if (user.password === data.password) {
              req.session.user = user;
              res.redirect("/post/show-post");
            } else {
              console.log("Your password is incorrect");
              res.redirect("/");
            }
          }
          else {
            res.redirect('/');
            console.log("There's no account associated with this username!");
          }
        });
        client.close();
      });
    }
  } else if (req.session.user.username === data.username) {
    res.redirect("/post/show-post");
    console.log("You're already logged in!");
  } else {
    res.redirect("/");
    console.log("Another User is currently login on this Computer");
  }
};

/**
 * Get /
 * signup
 */
handler_map.getSignup = function (req, res) {
  res.render('signup');
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
      db.collection("users").findOne({username: data.username}, function (err, user) {
        if (user) {
          console.log("User does Exist, please enter a different username");
          res.redirect("/signup");
        } else {
          db.collection("users").insertOne(data);
          db.collection("users").findOne({username: data.username}, function (err, foundUser) {
            if (foundUser) {
              req.session.user = foundUser;
              console.log("Congratulation, you just create an account");
              res.redirect("/post/show-post");
            }
          });
        }
        client.close();
      })
    });
  }
};

/**
 * Get /
 * Send Email Page
 */
handler_map.getSendEmail = function (req, res) {
  res.render('user/send-email');
};

/**
 * Post /
 * Send Link to the User's Email
 */
handler_map.postSendEmail = function (req, res, next) {
  async.waterfall([
      // Create a Token
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      // Update the Token in user Data
      function (token, done) {
        database.mongoclient.connect(database.url, function (err, client) {
          if (err) throw err;
          var db = client.db("cmpe-it");
          db.collection("users").update({email: req.body.email}, {
            $set: {
              "resetPasswordToken": token
              // "resetPasswordExpires": Date.now() + 3600000 // 1 hour
            }
          });
          done(err, token);
          client.close();
        });
      },
      // Find the User and Pass to the next function
      function (token, done) {
        database.mongoclient.connect(database.url, function (err, client) {
          if (err) throw err;
          var db = client.db("cmpe-it");
          db.collection("users").findOne({email: req.body.email}, function (err, user) {
            if (!user) {
              console.log("Email is not found!");
              return res.redirect('/send-email');
            }
            done(err, token, user);
          });
          client.close();
        });
      },
      // Send the Email to the User which is found above
      function (token, user, done) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          auth: {
            user: 'cmpeit131@gmail.com',
            pass: 'cmpe-it131'
          }
        });
        var url = 'http://' || 'https://';
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'CMPEit Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          url + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        transporter.sendMail(mailOptions, function (err) {
          console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ],
    // Catch Error if any
    function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/send-email');
    });
};


/**
 * Get /
 * Get Reset Password Page
 */
handler_map.getNewPassword = function (req, res) {
  res.render('user/reset-password', {
    token: req.params.token
  });
};

/**
 * Post /
 * Reset Password
 */
handler_map.postNewPassword = function (req, res, next) {
  var token = req.params.token;
  async.waterfall([
      // Find the User
      function(done) {
        database.mongoclient.connect(database.url, function (err, client) {
          if (err) throw err;
          var db = client.db("cmpe-it");
          db.collection("users").findOne({resetPasswordToken: token}, function (err, user) {
            if (!user) {
              return res.redirect('/');
            }
            done(err, user);
          });
          client.close();
        });
      },
      // Reset the Password in the Database
      function (user, done) {
        database.mongoclient.connect(database.url, function (err, client) {
          if (err) throw err;
          var db = client.db("cmpe-it");
          db.collection("users").update({resetPasswordToken: token}, {
            $set: {
              "password": req.body.password,
              "resetPasswordToken": ""
            }
          });
          done(err, user);
          client.close();
        });
      },
      // Send the Email to the User which is found above
      function (user, done) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          host: 'smtp.gmail.com',
          auth: {
            user: 'cmpeit131@gmail.com',
            pass: 'cmpe-it131'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'passwordreset@demo.com',
          subject: 'CMPEit Password Reset Successful',
          text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        transporter.sendMail(mailOptions, function (err) {
          console.log('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ],
    // Catch Error if any
    function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
};


/**
 * POST /logout
 * Log out.
 */
handler_map.logout = function(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
};

module.exports = handler_map;
