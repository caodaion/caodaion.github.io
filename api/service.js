const express = require('express')
const router = express.Router()

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', (req, res, next) => {
  res.send(`Welcome to service site`)
  next()
})

module.exports = router
