// secrect key
require('dotenv').config()
// middleware function
const mw = require('./middleware')
// express
const express = require('express');
// sessions
const sessions = require('express-session')

const app = express();
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false})) 
// template engine - ejs
app.set('view engine', 'ejs')
// serve static files
app.use(express.static('public'))

// express use sessions
app.use(sessions({
  secret: process.env.SESSION_SEC,
  resave: true,
  saveUninitialized:false
}))


// Routes
const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes')
const logoutRoute = require('./routes/logoutRoutes')

app.use('/login',loginRoute)
app.use('/register',registerRoute)
app.use('/logout',logoutRoute)

// api Routes
const postApiRoute = require('./routes/api/posts')

app.use('/api/posts',postApiRoute)

// database
// import database class
const mongoose = require('./database');
const { json } = require('express/lib/response');

app.get('/',mw.checkLoginSession,(req,res,next) => {
  // object data - sent to template engine
  const payload = {
    pageTitle: 'Home',
    loggedInUser: req.session.user,
    userObj: JSON.stringify(req.session.user)
  }
  res.render('index', {payload:payload})
})

const port = 3000
app.listen((process.env.PORT || port),()=>{
  console.log(`Server listening on PORT:${process.env.PORT || port}`)
})
