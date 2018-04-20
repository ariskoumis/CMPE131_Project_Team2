/**
 * Module dependencies.
 */
var express                 = require('express'),
    session                 = require('express-session'),
    bodyParser              = require('body-parser');

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
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  cookie: { maxAge: 60000 },
  secret: 'Cow',
  resave: false,
  saveUninitialized: true
}));

/**
 * Primary app routes.
 */
app.get('/', user.rootHandler);
app.get('/stream', user.initializeSSEHandler);

// User Routes
app.get("/logout", user.logout);
app.post('/login', user.login);
app.post('/signup', user.signup);

// Post Routes
app.get('/show-post', postRoute.showPost);
app.get('/new-post', postRoute.newPost);
app.post('/create-post', postRoute.createPost);

// Comment Routes
// app.get('/post/:id/comments/new', commentRoute.newComment);
// app.get('/post/:id/comments/edit', commentRoute.editComment);

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
