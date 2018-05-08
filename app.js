/**
 * Module dependencies.
 */
var express             = require('express'),
    session             = require('express-session'),
    methodOverride      = require('method-override'),
    bodyParser          = require('body-parser'),
    flash               = require('connect-flash');

/**
 * Route Handler
 */
var database            = require('./global/database.js'),
    user                = require('./routes/user.js'),
    commentRoute        = require('./routes/comment.js'),
    postRoute           = require('./routes/post.js');

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
app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session({
  cookieName: 'session',
  secret: 'cow_the_milk',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
  resave: false,
  saveUninitialized: false,
  maxAge: 60000
}));

app.use(flash());


app.use(function(req, res, next){
  res.locals.currUser  = req.session.user;
  res.locals.error        = req.flash("error");
  res.locals.success      = req.flash("success");
  next();
});

/**
 * Primary app routes.
 */
app.get('/', isLoggedin, user.rootHandler);

// User Routes
app.post('/login', user.login);
app.get("/signup", user.getSignup);
app.post('/signup', user.postSignup);
app.get("/logout", user.logout);

// Send Email for reset Password
app.get("/send-email", user.getSendEmail);
app.post("/send-email", user.postSendEmail);

// Reset Password
app.get("/reset/:token", user.getNewPassword);
app.post("/reset/:token", user.postNewPassword);

// Post Routes
app.get('/post/show-post', postRoute.showPost);
app.get('/post/new-post', requireLogin, postRoute.newPost);
app.post('/post/create-post', requireLogin, postRoute.createPost);
app.delete('/post/:id/delete-post', requireLogin, postRoute.deletePost);

// Like and Dislike a Post
app.post("/post/:id/like", requireLogin, postRoute.likePost);
app.post("/post/:id/dislike", requireLogin, postRoute.dislikePost);

// Comment Routes
app.get('/post/:id/comment/new-comment', requireLogin, commentRoute.getNewComment);
app.post('/post/:id/comment/create-comment', requireLogin, commentRoute.createNewComment);
app.delete('/post/:id/comment/:commentId/delete-comment', requireLogin, commentRoute.deleteComment);

/**
 * catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


/**
 * Middleware Function
 */
function requireLogin (req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
  } else {
    next();
  }
}

/**
 * Middleware Function
 * Check if user is logged in. If not,
 */
function isLoggedin (req, res, next) {
  if (req.session.user) {
    console.log("You're already logged in");
    res.redirect('/post/show-post');
  } else {
    next();
  }
}


/**
 * Start Express server.
 */
var PORT = process.env.PORT || 8000;
app.listen(PORT, process.env.IP, function() {
  console.log('Project hosted on port 8000');
});

module.exports = app;
