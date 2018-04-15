const { requireLogin } = require('../utils/auth');
const CASAuthentication = require('cas-authentication');

// Routes for authentication (signup, login, logout)
module.exports = function (app, passport) {

  const cas = new CASAuthentication({
    cas_url: 'https://cas.utc.fr/cas/',
    cas_version: '2.0',
    service_url: 'http://localhost:3651',
    session_info: 'cas_infos'
  });

  app.get('/login', cas.bounce, (req, res, next) => {
    if (requireLogin(req)) {
      // user is logged in
      console.log("Already logged in")
      res.render('profile', {
        loggedIn: requireLogin(req),
        email: req.session.cas_infos.mail,
        pseudo: req.session.cas_user,
        displayname: req.session.cas_infos.displayname
      })
    } else {
      res.render('index')
    }
  })

  app.get('/logout', function (req, res, next) {
    req.session = null
    res.render('index', {
      loggedIn: requireLogin(req)
    })
  })

  app.get('/profile', (req, res, next) => {
    if (requireLogin(req)) {
      casSession = req.session.cas_infos
      console.log(JSON.stringify("[profile.js]CasSession : " + JSON.stringify(casSession)))
      res.render('profile', {
        email: req.session.cas_infos.mail,
        pseudo: req.session.cas_user,
        displayname: req.session.cas_infos.displayname,
        loggedIn: requireLogin(req)
      })
    } else {
      // User is not authentified
      console.log("not logged in")
      res.render('login', {
        loggedIn: requireLogin(req),
      })
    }

  });
}
