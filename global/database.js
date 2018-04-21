/**
 * Module dependencies.
 */
const database  = {};

/***
 * Each database has multiple documents. Here are the documents in our db called "website" as of now.
 *     1. Users
 *     2. Posts
 *     3. Comments
 */
database.mongoclient         = require('mongodb').MongoClient;
database.url = "mongodb://calvin:q1w2e3r4@ds251819.mlab.com:51819/cmpe-it" || "mongodb://localhost:27017";
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
    console.log("Database Created");
    var db = client.db("cmpe-it");
    db.collection('posts').find({}).forEach(function(post) {
      database.listOfPost.push(post);
    });
    database.listOfPost.sort(function(a,b){
      return new Date(b.date) - new Date(a.date);
    });
  });
};

function sortPostByTime(list) {
  for(var i = 0; i < list.length - 1; i++) {
    if(list[i + 1].timestamp.date < list[i]) {

    }
  }
}

module.exports = database;
