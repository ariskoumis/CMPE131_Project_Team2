/**
 * Module dependencies.
 */
const database  = {};

/***
 * Each database has multiple documents. Here are the documents in our db called "website" as of now.
 *     1. Users
 *     2. Posts
 */
database.mongoclient    = require('mongodb').MongoClient;
database.url            = "mongodb://calvin:q1w2e3r4@ds251819.mlab.com:51819/cmpe-it" || "mongodb://localhost:27017";

module.exports = database;
