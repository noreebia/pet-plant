var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    console.log('Request for user resource arrived...');
    next()
  })

router.post('/', function (req, res) {
    res.send('dummy post route');
})

module.exports = router;