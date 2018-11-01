var express = require('express');
var router = express.Router();
var databaseService = require('../database-service');

// router.use(async function (req, res, next) {
//     console.log('');
//     let userKey = decodeURIComponent(req.body.user_key); // user's key
//     let type = decodeURIComponent(req.body.type); // message type
//     let content = decodeURIComponent(req.body.content); // user's message
    
//     let isExistingKakaotalkKey = await databaseService.kakaotalkKeyExistsInDatabase(userKey);
//     console.log(isExistingKakaotalkKey);
//     if(!isExistingKakaotalkKey){
//         const answer = {
//             // 카카오톡 user_id가 등록되지 않은경우
//             "message": {
//                 "text": `Pet Plant 앱과 현재 연동이 되어있지 않습니다. 연동을 하기 위해서는 \n1.하단의 링크를 클릭.\n2.첫 번째 양식에는 Pet Plant 앱에서 등록한 email을 입력해주시고, 두 번째 양식에는 '${userKey}'를 입력\n3. 등록 버튼 클릭`,
//                 "message_button": {
//                     "label": "연동하기.",
//                     "url": "http://117.16.136.73:8080/users/kakaotalk-registration"
//                 }
//             }
//         };
//         res.send(answer);
//     } else{
//         next();
//     }
// })



router.post('/', async function (req, res) {
    let user_key = decodeURIComponent(req.body.user_key); // user's key
    let type = decodeURIComponent(req.body.type); // message type
    let content = decodeURIComponent(req.body.content); // user's message
    let answer;
    let defaultMenu = ["대화하기", "Pet Plant 앱과 연동하기"];
    console.log(user_key);
    console.log(type);
    console.log(content);

    if (content.includes("대화하기")) {
        databaseService.getPlantsOfKakaotalkUser(user_key)
            .then((result) => {
                console.log(result)
            })

        answer = {
            // 카카오톡 user_id가 등록되지 않은경우
            "message": {
                "text": "안녕하세요 오랜만이에요.",
            }
        };
    }
    else if (content.includes("등록하기")) {
        answer = {
            // 카카오톡 user_id가 등록되지 않은경우
            "message": {
                "text": "USER ID: " + user_key + "\n등록방법!\n1. 하단 링크를 클릭해주세요.\n2. PetPlant 아이디와 상단의 유저 ID를 입력해주세요.\n 3.등록버튼을 누르시면 끝!",//+content  in case 'text'
                "message_button": {
                    "label": "등록하러 가기.",
                    "url": "http://117.16.136.73:8080/users/kakaotalk-registration"
                }
            }
        };
    }
    else if (content.includes("종료")) {
        answer = {
            "message": {
                "text": "나중에 또 대화해요!"
            },
            "keyboard": {
                "type": "buttons",
                "buttons": defaultMenu
            }
        };
    }
    else if (content.includes("상태")) {
        console.log("user key:" + user_key);
        let response;
        try {
            let plantName = await databaseService.getSelectedPlantOfKakaotalkUser(user_key);
            console.log(plantName.details);
            let log = await databaseService.getMostRecentLogOfSelectedPlantWithKakaoId(user_key);
            console.log(log);
            let measurements = log.details[0];
            console.log(measurements);
            let currentStatus = `온도는 ${measurements.temperature_level}이며, 습도는 ${measurements.moisture_level}이고 조도는 ${measurements.illumination_level}입니다!`;
            response = `'${plantName.details[0].nickname}'의 ${currentStatus}`;
        } catch (err) {
            console.log(err);
            response = "서버 오류가 발생했습니다."
        }
        answer = {
            "message": {
                "text": response
            }
        };
    }
    else {
        answer = {
            "message": {
                "text": "죄송합니다. 알 수 없는 질문입니다."
            },
            "keyboard": {
                "type": "buttons",
                "buttons": defaultMenu
            }
        };
    }
    res.send(answer);
});

module.exports = router;