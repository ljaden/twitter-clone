// secrect key
require('dotenv').config()
// middleware function
const mw = require('./middleware')

// express
const express = require('express');
const app = express();
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false})) 
// template engine - ejs
app.set('view engine', 'ejs')
// serve static files
app.use(express.static('public'))

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
    heading: 'This is a Twitter Clone'
  }
  res.render('index', {payload:payload})
})

// login route
app.get('/login',(req,res) => {
  res.render('./routes/login.ejs')
})

app.get('/register',(req,res,next) => {
  res.render ('./')
})

const port = 3000
app.listen((process.env.PORT || port),()=>{
  console.log(`Server listening: http://localhost:${port}/`)
})
