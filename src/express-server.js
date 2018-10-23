require('dotenv').config();
const express = require('express'),
    bodyParser = require('body-parser'),
    userRouter = require('./routers/user-router'),
    imageRouter = require('./routers/img-router'),
    databaseService = require('./database-service'),
    udpServer = require('./udp-server'),
    app = express();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// html
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// routers
app.use('/users', userRouter);
app.use('/images', imageRouter);

// default route for health check
app.get('/', function (req, res) {
    res.send("I'm healthy!");
})

// chatbot api route
app.get('/keyboard', function (req, res) {
    let answer = {
        "type": "buttons",
        "buttons": ["등록하기", "대화하기", "식물 선택하기", "사용법"]
    };
    res.send(answer);
})

// submit page
app.get('/submit', function (req, res) {
    res.render('submit');
})

app.post('/message', function (req, res) {
    let user_key = decodeURIComponent(req.body.user_key); // user's key
    let type = decodeURIComponent(req.body.type); // message type
    let content = decodeURIComponent(req.body.content); // user's message
    let answer;
    let defaultMenu = ["등록하기", "대화하기", "식물 선택하기", "사용법"];
    console.log(user_key);
    console.log(type);
    console.log(content);

    if (content.includes("식물 선택하기")) {
        let plantIds = [];
        databaseService.getPlantsOfKakaotalkUser(user_key)
            .then((result) => {
                result.details.forEach(function (id) {
                    plantIds.push(`${plantIds.length+1}번 식물: ${id}`);
                });
            })

        answer = {
            "message": {
                "text": "식물을 선택"
            },
            "keyboard": {
                "type": "buttons",
                "buttons": plantIds
            }
        };
    }
    else if (content.includes("대화하기")) {
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
                    "url": "http://117.16.136.73:8080/submit"
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
    else if (content.includes("식물:")) {
        let selection = content.split("식물: ")[1];
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

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Express app listening at http://%s:%s", host, port)
})
