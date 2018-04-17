/**
 * Module dependencies.
 */
const database            = {},
      mongo               = require('mongodb');

/***
 * Each database has multiple documents. Here are the documents in our db called "website" as of now.
 *     1. Users
 *     2. Posts
 *     3. Comments
 */
database.mongoclient  = mongo.MongoClient;
database.url          = "mongodb://localhost:27017";
database.currentUser  = {
  existed: false
};
database.listOfPost = [];

/**
 * Initialize Database
 */
database.init = function() {
  database.mongoclient.connect(database.url, function(err, client) {
    if (err) throw err;
    console.log("Database created!");
    client.close();
  });
};

module.exports = database;
