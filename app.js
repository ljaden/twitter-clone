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
app.use('/login',loginRoute)
app.use('/register',registerRoute)
// database
// import database class
const mongoose = require('./database')

app.get('/',mw.checkLoginSession,(req,res,next) => {
  // object data - sent to template engine
  const payload = {
    title: 'Twitter Clone',
    loggedInUser: req.session.user
  }
  // console.log(req.session.user)
  res.render('index', {payload:payload})
})

const port = 3000
app.listen((process.env.PORT || port),()=>{
  console.log(`Server listening: http://localhost:${port}/`)
})
