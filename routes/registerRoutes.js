const express = require('express')
const app = express()
const router = express.Router()

app.set('view engine', 'ejs')

// configire router to respon with rendering register page
router.get('/',(req,res,next) => {
  res.render('register')
})

module.exports = router;