var express = require('express');
var router = express.Router();
var databaseService = require('../database-service');
/* 처음 들어왔을 때 */
router.post('/', function(req, res) {
    let user_key = decodeURIComponent(req.body.user_key); // user's key
    let type = decodeURIComponent(req.body.type); // message type
    let content = decodeURIComponent(req.body.content); // user's message
    let answer;
    let defaultMenu = ["등록하기", "대화하기", "사용법"];
    console.log(user_key);
    console.log(type);
    console.log(content);
    /*
    if (content.includes("식물 선택하기")) {
        let plantIds = [];
        databaseService.getPlantsOfKakaotalkUser(user_key)
            .then((result) => {
                result.details.forEach(function(nickname) {
                    plantIds.push(`${plantIds.length+1}번 식물: ${nickname}`);
                });
            })
            if(plantIds.length == 0){
                plantIds.push("등록된 기기가 없습니다. 앱에서 기기 등록을 해주세요!");
            }
            console.log(plantIds);

        answer = {
            "message": {
                "text": "식물을 선택"
            },
            "keyboard": {
                "type": "buttons",
                "buttons": plantIds
            }
        };
    }*/
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
                "text": "종료되었습니다."//+content  in case 'text'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": defaultMenu
            }
        };
    }
    else if (content.includes("사용법")) {
        answer = {
            "message": {
                "text": "대화하기: 식물과 대화를 하지요. \n"//+content  in case 'text'
            },
            "keyboard": {
                "type": "buttons",
                "buttons": defaultMenu
            }
        };
    }
    else if (content.includes("식물: ")) {
        
        let selectedPlantNickname = content.split("식물: ")[1];

        let response;
        try{
            databaseService.selectPlant(selectedPlantNickname, user_key);
        } catch(err){
            response = "알 수 없는 오류입니다.";
        }
        response = `저는 ${selectedPlantNickname}입니다.}`;

        answer = {
            "message": {
                "text": selection
            },
            "keyboard": {
                "type": "buttons",
                "buttons": defaultMenu
            }
        };
    }
    else { // 
        if(content.includes("테스트")){
            answer = {
                "message": {
                    "text": "이것은 테스트입니다. 종료를 누르면 대화를 종료합니다."
                }
            };
        }
        else if(content.includes("종료")){
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
        else{
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
    }
    res.send(answer);
});

module.exports = router;