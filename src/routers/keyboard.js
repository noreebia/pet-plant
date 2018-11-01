var express = require('express');
var router = express.Router();
var databaseService = require('../database-service');

router.get('/', async function (req, res) {
    let answer = {
        "type": "buttons",
        "buttons": ["자유롭게 대화하기, 현재 상태 보기"]
    };
    res.send(answer);
});

module.exports = router;