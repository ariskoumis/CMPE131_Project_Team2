var express = require('express');
var app = express();

var database = require('./util/database.js');
var handlers = require('./util/route_handlers.js');

/**
 * Connect to MongoDB.
 */
database.init();

/**
 * Express configuration.
 */
app.use(express.static('public'));

//Establish endpoint handlers
app.get('/', handlers.rootHandler);
app.post('/testDB', handlers.testDBHandler);


/**
 * catch 404 and forward to error handler
 */
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });


/**
 * Start Express server.
 */
var PORT = process.env.PORT || 8000;
app.listen(PORT, process.env.IP, function() {
  console.log('Project hosted on port 8000');
});

module.exports = app;
