/**
 * Module dependencies.
 */
var EventEmitter  		= require('events'),
    mongo             = require('mongodb'),
    Stream 				  	= new EventEmitter(),
    database          = {};

/***
 * Each database has multiple documents. Here are the documents in our db called "website" as of now.
 *     1. Users
 *     2. Posts
 *     3. Comments
 */
database.mongoclient  = mongo.MongoClient;
database.url          = "mongodb://localhost:27017";


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

/**
 * SignUp function (Stream.emit doesn't work in this file, might fix this in the future to make Route_handlers.js look cleaner)
 */
database.signup = function(collection_name, input_data) {
  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    var db = client.db("mydb");
    db.collection(collection_name).findOne({username: input_data.username}, function (err, res) {
      if (res !== null) {
        console.log("User does Exist, please enter a different username");
        Stream.emit("push", "message", {event: "create_account_result", result: false});
      } else {
        console.log("Congratulation, you just create an account");
        db.collection("users").insertOne(input_data);
        Stream.emit("push", "message", {event: "create_account_result", result: true});
      }
      client.close();
    })
  });
};

/**
 * Login Function (Stream.emit doesn't work in this file, might fix this in the future to make Route_handlers.js look cleaner)
 */
database.login = function(collection_name, input_data) {
  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    var db = client.db("mydb");
    db.collection(collection_name).findOne({username: input_data.username}, function (err, res) {
      if (res !== null && res.password === input_data.password) {
        console.log("User Does Exist, Loggin successfully");
        Stream.emit("push", "message", {event: "login_result", result: true});
      } else {
        console.log("Please enter a correct password");
        Stream.emit("push", "message", {event: "login_result", result: false});
      }
      client.close();
    })
  });
};

module.exports = database;
