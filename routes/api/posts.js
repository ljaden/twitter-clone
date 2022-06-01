var express = require('express');
var app = express();
const router = express.Router()

const User = require('../../schemas/User_Schema')
const Tweet = require('../../schemas/Tweet_Schema')


// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}))
// for parsing json
app.use(express.json())

// GET
router.get('/', (req,res) => {
  Tweet.find()
  .populate("postedBy") // appends users info to the results
  .then(results => {
    res.status(200).send(results)
  })
  .catch(error => {
    console.log(error)
    res.sendStatus(400)
  })
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

// PUT
router.put('/:id/like', async(req,res) => {
  // data-id of post
  const postId = req.params.id
  // users id
  const userId = req.session.user['_id']
  // boolean if user already liked the post
  const isLiked = req.session.user.likes && req.session.user.likes.includes(postId)
  // ternary operator
  let options = isLiked ? "$pull": "$addToSet"
  // add||remove postId to Users' likes
  req.session.user = await User.findByIdAndUpdate(userId,{[options]: {likes: postId}},{new: true})
  .catch(error =>{
    console.log(error)
    res.send(400)
  })

  // add||remove userId from Posts' likes
  const post = await Tweet.findByIdAndUpdate(postId,{[options]: {likes: userId}},{new: true})
  .catch(error =>{
    console.log(error)
    res.send(400)
  })
  
  res.status(200).send(post)
})
module.exports = router;