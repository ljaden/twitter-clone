const express = require("express");
const app = express();
const router = express.Router();

app.use(express.urlencoded({ extended:false }))

// GET
router.get('/', (req,res) => {

})

// POST
router.post('/',(req,res) => {
  res.status(200).send('if you see this it works')
})

module.exports = router;