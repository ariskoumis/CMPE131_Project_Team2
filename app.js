/**
 * Module dependencies.
 */
var express             = require('express'),
    session             = require('express-session'),
    // cors                = require('cors'),
    bodyParser          = require('body-parser');

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
  saveUninitialized: false
}));

// app.use(cors());

/**
 * Primary app routes.
 */
app.get('/', user.rootHandler);
app.get('/stream', user.initializeSSEHandler);

// User Routes
app.post('/login', user.login);

app.get("/signup", user.getSignup);
app.post('/signup', user.postSignup);
app.get("/logout", user.logout);

// Post Routes
app.get('/post/show-post', postRoute.showPost);
app.get('/post/new-post', postRoute.newPost);
app.post('/post/create-post', postRoute.createPost);

// Comment Routes
app.get('/post/:id/comment/new-comment', commentRoute.getNewComment);
app.post('/post/:id/comment/create-comment', commentRoute.createNewComment);

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
