# cas-utc-session
This repository aims to offer a safe, reliable and efficient way to use the UTC CAS.

## Documentation

This repository tends to implement the patterns shown in  this article: [How do Express.js Sessions work? ](https://nodewebapps.com/2017/06/18/how-do-nodejs-sessions-work/)

## Libraries

The following libraries are higly recommanded to deal with CAS Session:

- [express.js](https://expressjs.com/) : a general framework for node.js API
- [cookie-session](https://github.com/expressjs/cookie-session) : An express package to deal with sessions by storing them like cookies. [cookie-parser](https://github.com/expressjs/cookie-parser) can be set to parse those cookies.
- [cas-authentication](https://github.com/kylepixel/cas-authentication): a package to deal with CAS Authentication.

### CAS-AUTHENTICATION

The [cas-authentication](https://github.com/kylepixel/cas-authentication) package is an npm package designed to be used in an express server. It contains 

## Setup: 
```javascript
const CASAuthentication = require('cas-authentication');

const cas = new CASAuthentication({
    cas_url         : 'https://cas.utc.fr/cas/',
    service_url     : 'https://my-service-host.',
    cas_version     : '2.0',
    session_info    : 'cas_infos',
})
```

 **Notes:**
 - UTC CAS accepts any service_url to gi authencation. However, some CAS might be more demanding on certificate.
 - The UTC CAS is working in 2.0 version. Do specify `cas_version     : '2.0'` or you might not be able to use the sessions.
 - `session_infos` is the name of the session you will get from the CAS.

## Usage
The 
```Javascript
 //When "Connect" is clicked, redirect to CAS (bounce) and then to Index with the new session
  app.get('/login', cas.bounce, (req, res, next) => {
    if (typeof req.session.cas_infos !== 'undefined') {
      // user is logged in
      console.log("Already logged in")
      res.json({
        loggedIn: true,
        email: req.session.cas_infos.mail,
        pseudo: req.session.cas_user,
        displayname: req.session.cas_infos.displayname
      })
    } else { //for some reason, the user does not have a cas_infos session after the cas.bounce. Refuse him the ressource
      res.json({
          loggedIn: false
      })
    }
  })
```


See [the readme](https://github.com/kylepixel/cas-authentication) for more example.