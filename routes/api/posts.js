var express = require('express');
var app = express();
const router = express.Router()

const User = require('../../schemas/User_Schema')
const Tweet = require('../../schemas/Tweet_Schema')


// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}))

// GET
router.get('/', (req,res) => {

})

// POST
router.post('/',async(req,res) => {
  // console.log('content: ', req.body) // => {content: '<tweet>'}
  if(!req.body.content) {
    console.log('Content param not sent with request')
    return res.sendStatus(400)
  }else if(req.session.user){
  // console.log(req.session.user)
  // console.log(typeof req.session.user)
    
  // Insert to DB
  Tweet.create({
    content: req.body.content,
    postedBy: req.session.user
  })
  .then(async (newTweet) => {
    // add Users data to 'postedby' key
    newTweet = await User.populate(newTweet,{path:'postedBy'})
    res.status(201).send(newTweet)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(400)
  })
  // console.log(req.body.content)
  }else{
    res.sendStatus(400)
  }
})

module.exports = router;