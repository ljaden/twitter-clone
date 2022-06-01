const mongoose = require('mongoose')

// Create a tweet schema
const Schema = mongoose.Schema

const TweetSchema = new Schema({
  content: {type: String, trim:true},
  postedBy: {type: Schema.Types.ObjectId, ref: 'User', required:true},
  likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  pinned: Boolean
}, {timestamps: true})


// Model constructor
const Tweet = mongoose.model('Tweet', TweetSchema)

// export
module.exports = Tweet;