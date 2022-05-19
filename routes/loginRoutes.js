const express = require('express')
const app = express()
const router = express.Router()

app.set('view engine','ejs')

//  configure router to respond with rendering login page
router.get('/', (req,res,next) => {
  res.render('login')
})

module.exports = router;