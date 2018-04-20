/**
 * Module dependencies.
 */
const database            = {};

/***
 * Each database has multiple documents. Here are the documents in our db called "website" as of now.
 *     1. Users
 *     2. Posts
 *     3. Comments
 */
database.mongoclient         = require('mongodb').MongoClient;
// database.url          = "mongodb://localhost:27017";
database.url = "mongodb://calvin:q1w2e3r4@ds251819.mlab.com:51819/cmpe-it";
database.currentUser  = {
  existed: false
};
database.listOfPost = [];
database.listOfComments = [];

/**
 * Initialize Database
 */
database.init = function() {
  console.log(database.url);
  database.mongoclient.connect(database.url, (err, client) => {
    if (err) {
      return console.log(err);
    }
    console.log("Database Created");
    client.db("cmpe-it").collection('posts').find({}).forEach(function(post) {
      console.log(post);
      database.listOfPost.push(post);
    });
  });
};

module.exports = database;
