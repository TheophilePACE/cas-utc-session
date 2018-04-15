var cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');
var ejs = require('ejs');
const cookieSession = require('cookie-session')
var logger = require('morgan');
var bodyParser = require('body-parser');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Set up favicon, logging, parsing, static files
// Uncomment after placing your favicon in public/images/
//app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

//set up the sessions to be stored in cookies for 2 hours
let expiryDate = new Date(Date.now() + 120 * 60 * 1000) // 2 hour
app.use(cookieSession({
  name: 'cas_infos',
  keys: ["Fillon", "rend", "largent"],
  // Cookie Options
  maxAge: expiryDate
}))
// Set up routes and pass in configured passport
require('./routes/index.js')(app);
require('./routes/auth.js')(app);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// No stacktraces leaked to user
app.use(function (err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
