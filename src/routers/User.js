var express = require('express');
var router = express.Router();
const databaseService = require('../DatabaseService');

router.use(function (req, res, next) {
    console.log('Request for user resource arrived...');
    next()
})

router.post('/', function (req, res) {
    let user = req.body;
    databaseService.saveUser(user.email, user.password, function (result) {
        console.log(result);
    });
    res.send('successful!');
})

module.exports = router;