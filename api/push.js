const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
});

router.get('/', (req, res, next) => {
  res.send(`Welcome to push site`);
  next();
});

router.get('/subscribe', (req, res, next) => {
  res.send(req.body || 'The subscription was not approved');
  next();
});

router.get('/send', (req, res, next) => {
  res.send(req.body || 'The subscription was not approved');
  next();
});

module.exports = router
