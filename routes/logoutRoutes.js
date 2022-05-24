const express = require('express')
const app = express()
const router = express.Router()



router.get('/', (req,res) => {
  // console.log('logout: ',req.session, req.session.user, 'end')
  req.session.destroy(() => {
    return res.redirect('/login')
  })
})

module.exports = router