/**
 * Module dependencies.
 */
var express       = require('express'),
    bodyParser    = require('body-parser'),
    database      = require('./util/database.js'),
    handlers      = require('./util/route_handlers.js');

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


/**
 * Primary app routes.
 */
app.get('/', handlers.rootHandler);
app.get('/stream', handlers.initializeSSEHandler);
app.post('/attempt-login', handlers.attemptLoginHandler);
app.post('/create-account', handlers.createAccountHandler);

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
