var express = require('express');
var router = express.Router();

router.get('/', async function (req, res) {
    let answer = {
        "type": "buttons",
        "buttons": ["식물과 자유롭게 대화하기", "식물의 현재 상태 보기"]
    };
    res.send(answer);
});

module.exports = router;