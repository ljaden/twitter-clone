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

router.post('/', async (req,res,next) => {

  const fullname = req.body.fullname
  const email = req.body.email
  const username = req.body.username
  const password = req.body.password

  // if register form is filled
  if(fullname && email && username && password){
    
    const user = await User.findOne({  //query db for identical username||emails
      $or: [{username: username},{email: email}]
    })
    // console.log(user)
    
    if(user === null){  // if username||email doesn't exist, register to database
      User.create({
        fullname: fullname,
        email: email,
        username: username,
        password: password
      },
      () => res.send('Registered your account!'))
    }else { // else register User data into db
      if(email === user.email){ //email already in use
        console.log('Email is already in use!')

      }else if(username === user.username) {
        // username already in use
        console.log('Username already in use!')
      }
      // redirect back to /register
      res.redirect('/register')
    }
  }
})

module.exports = router;