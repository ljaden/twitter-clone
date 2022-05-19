// connect to database(mongoDB) via mongoose library
const mongoose = require('mongoose')

// connection class
class Database{

  constructor() {
    this.connect();
  }

  connect() {
    // connecting to DB
    mongoose.connect(`mongodb+srv://projecttwitter:${process.env.SECRET_KEY}@twitterclone.vhidm.mongodb.net/?retryWrites=true&w=majority/twitterClone`)
    .then( () => {  // if connectiong successful print 'Connected to database'
      console.log('Connected to database')
    })
    .catch( (err) => {  // print error 
      console.log(`${err}`)
    })
  }
}

module.exports = new Database()