const express                 = require('express'),
      path                    = require('path'),
      mongoose                = require("mongoose"),
      passport                = require("passport"),
      flash                   = require('express-flash'),
      methodOverride          = require("method-override"),
      bodyParser              = require('body-parser'),
      localStrategy           = require("passport-local"),
      User                    = require("./models/user");

/**
 * Controllers (route handlers).
 */
// Home route to handle Home Page and other pages (if coming up in the future
// const homeRoute = require('./routes/home');
// User route to handle Login Logout Signup routes
// const userRoute = require('./routes/user');
const handlers = require('./util/route_handlers.js');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/CMPEit", {});

/**
 * Express configuration.
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true})) ;
app.use(methodOverride("_method"));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
// app.use(flash());

/**
 * Uncomment to use to handle User Authentication
 */
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * Primary app routes.
 */
// app.get("/", homeRoute.index);
app.get('/', handlers.root_handler);


/**
 * catch 404 and forward to error handler
 */
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/**
 * error handler
 */
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Start Express server.
 */
var PORT = process.env.PORT || 8000;
app.listen(PORT, process.env.IP, function() {
  console.log('Project hosted on port 8000');
});

module.exports = app;
