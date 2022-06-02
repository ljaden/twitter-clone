const mongoose = require('mongoose')

// Creating a user schema
const Schema = mongoose.Schema
const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  username: {
    type: String,
    require: true,
    unique: true
  },
  password: {
    type: String,
    require: true,
  },
  profilePic: {type: String, default: '../imgs/default.png'},
  likes: [{type: Schema.Types.ObjectId, ref: 'Tweet'}],
  retweets: [{type: Schema.Types.ObjectId, ref: 'Tweet'}],
  
},{timestamps: true})

// Model constructor
const User = mongoose.model('User', UserSchema)

//export
module.exports = User;