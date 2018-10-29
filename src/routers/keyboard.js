var express = require('express');
var router = express.Router();

/* 처음 들어왔을 때 */
router.get('/', function (req, res) {
    let answer = {
        "type": "buttons",
        "buttons": ["등록하기", "대화하기", "사용법"]
    };
    res.send(answer);
});

module.exports = router;