var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    let log = req.body;
    console.log(log);
    res.send("Saving log to database...");
})

module.exports = router;