var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

/***
 * Each database has multiple documents. Here are the documents in our db called "website" as of now.
 *     1. Users
 *     2. Posts
 *     3. Comments
 */

var database = {};
var url = "mongodb://localhost:27017";

database.mongoclient = mongo.MongoClient;
database.url = "mongodb://localhost:27017/mydb";

database.init = function() {

    database.mongoclient.connect(url, function(err, client) {
        if (err) throw err;
        console.log("Database created!");
        client.close();
    });

}

database.write = function(collection_name, data) {

    database.mongoclient.connect(url, function(err, client) {
        if (err) throw err;
        
        var db = client.db("mydb");        
        db.collection(collection_name).insertOne(data);
        client.close();
    });

}


module.exports = database;