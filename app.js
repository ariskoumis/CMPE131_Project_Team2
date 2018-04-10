var express = require('express');
var mongo = require('mongodb');
var app = express();

/**
 * Import Controllers (route handlers for enpoints).
 */
var handlers = require('./util/route_handlers.js');

/**
 * Connect to MongoDB.
 */
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

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
