/**
 * Module dependencies.
 */
var express       = require('express'),
    session       = require('express-session'),
    bodyParser    = require('body-parser');

/**
 * Route Handler
 */
var database            = require('./global/database.js'),
    homeRoute           = require('./routes/user.js'),
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
app.get('/', homeRoute.rootHandler);
app.get('/stream', homeRoute.initializeSSEHandler);
app.post('/login', homeRoute.login);
app.post('/signup', homeRoute.signup);

app.get('/show-post', postRoute.showPost);
app.get('/new-post', postRoute.newPost);
app.post('/create-post', postRoute.createPost);

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
