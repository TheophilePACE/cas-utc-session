const CASAuthentication = require('cas-authentication');
const cookieSession = require('cookie-session')

const { requireLogin } = require('../utils/auth');

const { service_url, cas_url, cas_version, service_port } = require('../config')

// Routes for authentication (signup, login, logout)
module.exports = function (app, passport) {

  //set up the sessions to be stored in cookies for 2 hours
  let expiryDate = new Date(Date.now() + 120 * 60 * 1000) // 2 hour
  app.use(cookieSession({
    name: 'cas_infos',
    keys: ["Fillon", "rend", "largent"],
    // Cookie Options
    maxAge: expiryDate
  }))

  //CAS OBject to precise which CAS to use and how to call the session.
  const cas = new CASAuthentication({
    cas_url, // URL of UTC CAS 
    cas_version, // CAS VErsion. 2 for UTC
    service_url: service_url + ':' + service_port, //your URL
    session_info: 'cas_infos' //name for the session send back by the CAS
  })

  //When "Connect" is clicked, redirect to CAS (bounce) and then to Index with the new session
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

  //When disconnect is clicked, just delete the session
  app.get('/logout', (req, res, next) => {
    req.session = null
    res.redirect('index')
  })

  //When the user consult his profile
  app.get('/profile', (req, res, next) => {
    if (requireLogin(req)) {
      //the user is logged in. Get and display his infos
      casSession = req.session.cas_infos
      console.log(JSON.stringify("[profile.js]CasSession : " + JSON.stringify(casSession)))
      res.render('profile', {
        email: req.session.cas_infos.mail,
        pseudo: req.session.cas_user,
        displayname: req.session.cas_infos.displayname,
        loggedIn: requireLogin(req)
      })
    } else {
      // The user is not logged in. Rederiction to connection page.
      console.log("not logged in")
      res.redirect('login', {
        loggedIn: requireLogin(req),
      })
    }

  });
}
