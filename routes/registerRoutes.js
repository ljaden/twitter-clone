const express = require("express");
const app = express();
const router = express.Router();

//bcrypt saltRound and hash
const bcrypt = require("bcrypt");
const saltRound = 10;

//database - UserSchema
const User = require("../schemas/User_Schema");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

// configure router to respond with rendering register page

router.get("/", (req, res, next) => {
  let payload = {
    title: "Register",
  };
  // check for existing session
  if(req.session && req.session.user){
    res.redirect('/') // redirect to home
  } else {
    // go to register
    res.render("register", { payload: payload });
  }
});

router.post("/", async (req, res, next) => {
  let payload = req.body;

  const fullname = req.body.fullname;
  const email = req.body.email;
  const username = req.body.username;

  // if register form is filled
  if (fullname && email && username) {
    const user = await User.findOne({
      //query db for identical username||emails
      $or: [{ username: username }, { email: email }],
    });
    // console.log(user)

    if (user === null) {
      // if username||email doesn't exist, register to database
      // hashing pw
      const password = await bcrypt.hash(req.body.password, saltRound);

      User.create({
        fullname: fullname,
        email: email,
        username: username,
        password: password,
      }).then((userinfo) => {
        // use userinfo as cookie session
        req.session.user = userinfo;
        return res.redirect("/");
      });
    } else {
      // User already exist
      if (email === user.email && username === user.username) {
        //both already in use
        payload.errorMessage = "Username & Email is already in use!";
      } else if (username === user.username) {
        // username already in use
        payload.errorMessage = "Username already in use!";
      } else {
        // email already in use
        payload.errorMessage = "Email already in use!";
      }

      // redirect back to /register
      res.render("register", { payload: payload });
    }
  } else {
    res.render("register", { payload: payload });
  }
});

module.exports = router;
