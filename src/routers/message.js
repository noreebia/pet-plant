var express = require('express');
var router = express.Router();
var databaseService = require('../database-service');

router.post('/', async function (req, res) {
    let userKey = decodeURIComponent(req.body.user_key); // user's key
    let type = decodeURIComponent(req.body.type); // message type
    let content = decodeURIComponent(req.body.content); // user's message
    let answer;

    console.log(userKey);
    console.log(type);
    console.log(content);

    if (content.includes("@")) {
        let response;
        let emailExists = await databaseService.isExistingEmailExportVersion(content);
        if(emailExists){
            await databaseService.registerKakaotalkId(content, userKey);
            response = "정상적으로 연동이 되었습니다. 무슨 일이신가요 주인님?";
        } else{
            response = "존재하지 않는 이메일 계정입니다. 확인을 한 후에 다시 보내주세요.";
        }
        answer = {
            "message": {
                "text": response
            }
        };
        res.send(answer);
        return;
    }

    let isExistingKakaotalkKey = await databaseService.kakaotalkKeyExistsInDatabase(userKey);
    console.log(isExistingKakaotalkKey);
    if (!isExistingKakaotalkKey) {
        const answer = {
            "message": {
                "text": `Pet Plant 앱과 현재 연동이 되어있지 않습니다. 연동을 하기 위해서 Pet Plant 앱에서 등록한 아이디를 보내주세요.`,
            }
        };
        res.send(answer);
        return;
    }

    let plantNameQuery;
    try{
        plantNameQuery = await databaseService.getSelectedPlantOfKakaotalkUser(userKey);
    } catch(err){
        res.send("서버 오류가 발생하였습니다.");
        return;
    }
    if(plantNameQuery.details.length == 0){
        const answer = {
            "message": {
                "text": `현재 등록된 식물이 없습니다. 앱에서 식물을 등록해주세요!`,
            }
        };
        res.send(answer);
        return;
    }

    let plantName = plantNameQuery.details[0].nickname;

    if (content.includes("대화하기")) {
        let response = `저는 '${plantName}'입니다. 무슨 일이신가요 주인님?`;
        answer = {
            "message": {
                "text": response
            }
        };
    }

    else if (content.includes("잘자") || content.includes("잘 자")) {
        answer = {
            "message": {
                "text": "안녕히 주무세요 주인님!"
            }
        };
    }
    else if (content.includes("도움말")) {
        answer = {
            "message": {
                "text": "Pet Plant 앱에서 email 계정으로 가입 후, 키우시는 식물의 사진을 찍어서 등록을 해주세요! 그 후 대화를 원하시는 식물을 앱에서 선택해주시면 됩니다."
            }
        };
    }

    else if (content.includes("상태")) {
        console.log("user key:" + userKey);
        let response;
        try {
            let log = await databaseService.getMostRecentLogOfSelectedPlantWithKakaoId(userKey);
            console.log(log);
            let measurements = log.details[0];
            console.log(measurements);
            let currentStatus = `온도는 ${measurements.temperature_level}이며, 습도는 ${measurements.moisture_level}이고 조도는 ${measurements.illumination_level}입니다!`;
            response = `'${plantName}'의 ${currentStatus}`;
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
                "text": "무슨 말인지 모르겠어요 주인님."
            }
        };
    }
    res.send(answer);
});

kakaotalkExists = (kakaotalkId) => {
    let isExistingKakaotalkKey = await databaseService.kakaotalkKeyExistsInDatabase(kakaotalkId);
    console.log(isExistingKakaotalkKey);
    if (!isExistingKakaotalkKey) {
        const answer = {
            "message": {
                "text": `Pet Plant 앱과 현재 연동이 되어있지 않습니다. 연동을 하기 위해서는 \n1.하단의 링크를 클릭.\n2.첫 번째 양식에는 Pet Plant 앱에서 등록한 email을 입력해주시고, 두 번째 양식에는 '${userKey}'를 입력\n3. 등록 버튼 클릭`,
                "message_button": {
                    "label": "연동하기.",
                    "url": "http://117.16.136.73:8080/users/kakaotalk-registration"
                }
            }
        };
        res.send(answer);
        return;
    }
}


module.exports = router;