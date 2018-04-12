var EventEmitter = require('events');

var handler_map = {};
var path = require('path');
var database = require('./database.js');
const Stream = new EventEmitter();

handler_map.rootHandler = function (req, res) {
  res.set("Content-Type", "text/html");
  res.sendFile(path.resolve(__dirname + '/../public/index.html'), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("we good.")
    }
  });
};

handler_map.attemptLoginHandler = function (req, res) {
  var data = req.body;
  console.log("attempt login");

  database.mongoclient.connect(database.url, function(err, client) {
    if (err) throw err;
    var db = client.db("mydb");
    db.collection("users").findOne({username: data.username}, function (err, res) {
      if (res !== null && res.password === data.password) {
        console.log("User Does Exist, Loggin successfully");
        Stream.emit("push", "message", { event: "login_result", result: true});
      } else {
        console.log("Please enter a correct password");
        Stream.emit("push", "message", { event: "login_result", result: false});
      }
      client.close();
    })
  });
};

handler_map.createAccountHandler = function (req, res) {
  var data = req.body;

  //Write to data to collection titled 'users'
  database.mongoclient.connect(database.url, function (err, client) {
    if (err) throw err;
    var db = client.db("mydb");
    db.collection("users").findOne({ username: data.username }, function (err, res) {
      if (res !== null) {
        console.log("User does Exist, please enter a different username");
        Stream.emit("push", "message", { event: "create_account_result", result: false });
      } else {
        console.log("Congratulation, you just create an account");
        db.collection("users").insertOne(data);
        Stream.emit("push", "message", { event: "create_account_result", result: true });
      }
      client.close();
    })
  });


  // var success = database.write("users", data);
  // console.log("This is the line: " + success);
};

handler_map.initializeSSEHandler = function (req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  Stream.on("push", function (event, data) {
    res.write("event: " + String(event) + "\n" + "data: " + JSON.stringify(data) + "\n\n");
  });
};

//export
module.exports = handler_map;
