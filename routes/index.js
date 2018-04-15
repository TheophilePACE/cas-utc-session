const { requireLogin } = require('../utils/auth');

// Main routes for app
module.exports = function (app) {

  app.get('/', function (req, res, next) {

    res.render('index', { loggedIn: requireLogin(req) });

  });
  app.get('/index', function (req, res, next) {

    res.render('index', { loggedIn: requireLogin(req) })

  });

};
