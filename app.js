/**
 * Module dependencies.
 */
var express                 = require('express'),
    bodyParser              = require('body-parser'),
    passport                = require("passport"),
    User                    = require("./models/user.js"),
    localStrategy           = require("passport-local");

/**
 * Route Handler
 */
var database        = require('./util/database.js'),
    homeRoute       = require('./util/index.js'),
    postRoute       = require('./util/post.js');

var currUser = homeRoute.currentUser;
/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
database.init();

/**
 * Express configuration.
 */
//Serve all folders in public directory to localhost
app.use(express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(passport.initialize());
passport.use(new localStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

/**
 * Primary app routes.
 */
app.get('/', homeRoute.rootHandler);
app.get('/stream', homeRoute.initializeSSEHandler);
app.post('/attempt-login', homeRoute.attemptLoginHandler);
app.post('/create-account', homeRoute.createAccountHandler);
// app.post('/create-account', homeRoute.register);

app.get('/new-post', postRoute.getPostForm);
app.get('/show-post', postRoute.showPost);
app.post('/create-post', postRoute.createAPostHandler);

/**
 * catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * Start Express server.
 */
var PORT = process.env.PORT || 8000;
app.listen(PORT, process.env.IP, function() {
  console.log('Project hosted on port 8000');
});

module.exports = app;
