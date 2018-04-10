const express                 = require('express'),
      mongoose                = require("mongoose");

/**
 * Controllers (route handlers).
 */
const handlers = require('./util/route_handlers.js');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/CMPEit", {});

/**
 * Express configuration.
 */
app.use(express.static('public'));

<<<<<<< HEAD
//Establish endpoint handlers
app.get('/', handlers.rootHandler);
app.get('/home', handlers.homeHandler);
=======
/**
 * Primary app routes.
 */
// app.get("/", homeRoute.index);
app.get('/', handlers.root_handler);
>>>>>>> 1aeca987e0ecf0e2dffb260f97881a971553fe80


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
