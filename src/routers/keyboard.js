var express = require('express');
var router = express.Router();
// var databaseService = require('../database-service');

router.get('/', async function (req, res) {
    // console.log("yah");
    // let userKey = decodeURIComponent(req.body.user_key); // user's key
    // console.log(userKey);
    // let isExistingKakaotalkKey = await databaseService.kakaotalkKeyExistsInDatabase(userKey);
    // console.log(isExistingKakaotalkKey);
    // if(!isExistingKakaotalkKey){
    //     const answer = {
    //         "message": {
    //             "text": `Pet Plant 앱과 현재 연동이 되어있지 않습니다. 연동을 하기 위해서는 \n1.하단의 링크를 클릭.\n2.첫 번째 양식에는 Pet Plant 앱에서 등록한 email을 입력해주시고, 두 번째 양식에는 '${userKey}'를 입력\n3. 등록 버튼 클릭`,
    //             "message_button": {
    //                 "label": "연동하기.",
    //                 "url": "http://117.16.136.73:8080/users/kakaotalk-registration"
    //             }
    //         }
    //     };
    //     res.send(answer);
    //     return;
    // }
    let answer = {
        "type": "buttons",
        "buttons": ["대화하기"]
    };
    res.send(answer);
});

module.exports = router;