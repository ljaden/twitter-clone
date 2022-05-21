const express = require("express");
const app = express();
const router = express.Router();
app.set("view engine", "ejs");

// require bcrypt
const bcrypt = require("bcrypt");
// database - UserSchema
const User = require("../schemas/User_Schema");
const { redirect } = require("express/lib/response");

//  configure router to respond with rendering login page
router.get("/", (req, res, next) => {
  const payload = {
    title: "Login",
  };

  // check for existing sessions
  if (req.session && req.session.user) {
    res.redirect("/"); // redirect to home
  } else {
    // got to login
    res.render("login", { payload: payload });
  }
});

router.post("/", async (req, res, next) => {
  // console.log(req.session.user)
  payload = req.body;
  // get username & password
  // console.log(req.body)
  const username = req.body.loginUsername;
  const password = req.body.loginPassword;

  // query database for username
  const existingUser = await User.findOne({ username: username });

  // username exists
  if (existingUser) {
    // compare password
    boolPassword = await bcrypt.compare(password, existingUser.password);

    if (boolPassword) {
      // correct password
      // store session
      req.session.user = existingUser;

      res.redirect("/");
    } else {
      // incorrect password
      payload.errorMessage = "Incorrect password. Please try again.";
      // console.log(payload)
      res.render("login", { payload: payload });
    }
  } else {
    // User doesn't exist
    payload.errorMessage = "Username doesn't exist.";

    res.render("login", { payload: payload });
  }

  // res.render('login')
});
module.exports = router;
