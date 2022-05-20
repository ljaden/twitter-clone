// custom middlewarefunction to check if users are logged in
exports.checkLoginSession = (req,res, next) => {
  // check if users are logged in (session property && user session property)
  if (req.session && req.session.user) { // (t) proceed
    return next(); 
  } else {  // (f) redirect user to login page
    // console.log(req.session)
    return res.redirect('/login')
  }
}