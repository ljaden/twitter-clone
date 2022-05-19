const express = require('express')
const app = express()
const router = express.Router()

//database - UserSchema
const User = require('../schemas/User_Schema')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false})) // for parsing application/x-www-form-urlencoded

// configure router to respond with rendering register page
router.get('/',(req,res,next) => {
  res.render('register')
})

router.post('/', (req,res,next) => {

  const fullname = req.body.fullname
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password

  // console.log(fullname,email,username,password)
  // if register form is filled
  if(fullname && email && username && password){
    User.findOne({  //query db for identical username||emails
      $or: [
        {username: username},
        {email: email}
        ]
    }).then((result) => {
      if(result !== null){  // if username||email already exist, redirect back to register page
        res.redirect('/register')
      }else { // else register User data into db
        User.create({
          fullname: fullname,
          email: email,
          username: username,
          password: password
        },()=> res.send('Registered your account!'))
      }
    })
  }
})

module.exports = router;