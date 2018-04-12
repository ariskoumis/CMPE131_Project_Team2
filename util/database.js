var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

/***
 * Each database has multiple documents. Here are the documents in our db called "website" as of now.
 *     1. Users
 *     2. Posts
 *     3. Comments
 */

var database = {};
database.mongoclient = mongo.MongoClient;
database.url = "mongodb://localhost:27017";
database.result = false;

database.init = function() {
    database.mongoclient.connect(database.url, function(err, client) {
        if (err) throw err;
        console.log("Database created!");
        client.close();
    });

};
database.write = function(collection_name, input_data) {
    database.mongoclient.connect(database.url, function(err, client) {
      if (err) throw err;
      var db = client.db("mydb");
      db.collection(collection_name).findOne({username: input_data.username}, function (err, res) {
        if (res !== null) {
          console.log("User does Exist, please enter a different username");
          client.close();
        } else {
          console.log("Congratulation, you just create an account");
          db.collection(collection_name).insertOne(input_data);
          client.close();
          database.res = true;
        }
      });
    });
    return database.result;
};

function showResult() {

}

module.exports = database;