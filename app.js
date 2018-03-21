const express                 = require('express'),
      handlers                = require('./util/route_handlers.js'),
      mongoose                = require("mongoose"),
      passport                = require("passport"),
      methodOverride          = require("method-override"),
      bodyParser              = require('body-parser'),
      localStrategy           = require("passport-local"),
      User                    = require("./models/user");

/**
 * Controllers (route handlers).
 */
const homeRoute = require('./routes/home'),
      userRoute = require('./routes/user');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/CMPEit", {
  useMongoClient: true
});

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
app.use(flash());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/**
 * Primary app routes.
 */
app.get('/', handlers.root_handler);
app.get("/", homeRoute.index);
app.get('/login', userRoute.getLogin);
app.post('/login', userRoute.postLogin);
app.get('/logout', userRoute.logout);
app.get('/signup', userRoute.getSignup);
app.post('/signup', userRoute.postSignup);


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
  console.log('Project hosted on port ${PORT}!');
});

module.exports = app;
