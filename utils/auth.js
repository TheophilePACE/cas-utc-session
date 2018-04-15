// Route middleware to make sure a user is logged in
const requireLogin = (req) => {
  // If user is authentication in the session, carry on
  try {
    if (typeof req.session.cas_user !== 'undefined')
      return req.session.cas_infos.displayname
  }
  catch (error) {
    console.log(error)
    return false
  }
}



// Route middleware to redirect a logged in user to their profile


exports.requireLogin = requireLogin;