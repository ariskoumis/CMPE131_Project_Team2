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
database.listOfComments = [];

/**
 * Initialize Database
 */
database.init = function() {
  database.mongoclient.connect(database.url, function(err, client) {
    if (err) throw err;
    var db = client.db("mydb");
    console.log("Database created!");
    db.collection("posts").find({}).forEach(function(post){
      database.listOfPost.push(post);
    });
    client.close();
  });
};

module.exports = database;
