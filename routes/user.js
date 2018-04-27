/**
 * Module dependencies.
 */
var database 				= require('../global/database.js'),
    async               = require('async'),
    crypto              = require('crypto'),
    bcrypt              = require('bcrypt-nodejs'),
    nodemailer          = require('nodemailer'),
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
 * Reset Password Page
 */
handler_map.getResetPassword = function (req, res) {
  res.render('reset-password', { currentUser: database.currentUser });
};

/**
 * Post /
 * Reset Password
 * This code follow this link: http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
 */
handler_map.getResetPassword = function (req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      database.mongoclient.connect(database.url, function(err, client) {
        if (err) throw err;
        var db = client.db("cmpe-it");
        db.collection("users").findOne({email: req.body.email}, function (err, user) {
          if (!user) {
            return res.redirect('/reset-password');
          }
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function(err) {
            done(err, token, user);
          });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport('SMTP', {
        service: 'SendGrid',
        auth: {
          user: '!!! YOUR SENDGRID USERNAME !!!',
          pass: '!!! YOUR SENDGRID PASSWORD !!!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
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
              resetPasswordToken: String,
              resetPasswordExpires: Date,
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
