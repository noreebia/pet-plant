var express = require('express');
var router = express.Router();
const databaseService = require('../database-service');
let DTO = require('../dto');
let parser = require('fast-xml-parser');
let axios = require('axios');
let Measurement = require('../measurement');
let nongsaro = require('../nongsaro');

router.use(function (req, res, next) {
    console.log('Request for user resource arrived...');
    next();
})

router.get('/:userEmail/plants', function (req, res) {
    databaseService.getPlantsOfUser(req.params.userEmail)
        .then((result) => res.json(result))
        .catch((error) => res.json(error))
})

router.post('/validation', (req, res) => {
    databaseService.isValidCredentials(req.body.email, req.body.password)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)));
})

router.post('/', function (req, res) {
    databaseService.createUser(req.body.email, req.body.password)
        .then((result) => res.json(result))
        .catch((error) => res.json(new DTO(false, error.message)))
})

router.post('/register_kakao', function (req, res) {
    let email = req.body.petplantID;
    let kakao = req.body.kakaoID;

    databaseService.registerKakaotalkId(email, kakao)
        .then(() => res.render('success'))
        .catch((error) => res.json(error));
})

router.post('/plants', function (req, res) {
    let plantId = req.body.plantId;
    let userEmail = req.body.userEmail;
    let species = req.body.species;
    let nickname = req.body.nickname;

    databaseService.registerPlant(plantId, userEmail, species, nickname)
        .then((result) => res.json(result))
        .catch((error) => res.json(error))
})

router.get('/kakaotalk-registration', function (req, res) {
    res.render('kakaotalk-registration');
})

router.get('/:userEmail', function (req, res) {
    databaseService.getUserByEmail(req.params.userEmail)
        .then((result) => res.json(new DTO(true, result)))
        .catch((error) => res.json(new DTO(false, error.message)))
})

// testing purposes

router.post('/plants/selection', function (req, res) {
    let nickname = req.body.nickname;
    let email = req.body.email;
    console.log(email);
    databaseService.selectPlant(nickname, email)
        .then((result) => res.json(result))
        .catch((error) => res.json(error))
})

router.get('/plants/selection/:userEmail', function (req, res) {
    let email = req.params.userEmail;
    console.log(email);
    databaseService.getSelectedPlantOfUser(email)
        .then((result) => res.json(result))
        .catch((error) => res.json(error))
})

router.get('/plants/logs/:userEmail', (req, res) => {
    let email = req.params.userEmail;
    console.log(email);
    databaseService.getMostRecentLogOfSelectedPlant(email)
        .then((result) => res.json(result))
        .catch((error) => res.json(error))
})

router.post('/registration', (req, res) => {
    let kakaotalkId = req.body.kakaotalkId;
    databaseService.kakaotalkKeyExistsInDatabase(kakaotalkId)
        .then((exists) => console.log(exists))
        .catch((error) => res.json(error));
})

router.get('/testtest/:username', (req, res) => {
    let email = req.params.username;
    databaseService.getSelectedPlantOfKakaotalkUser(email)
        .then((exists) => {
            console.log(exists);
            res.send(exists);
        })
        .catch((error) => res.json(error));
})

router.get('/public/nongsaro/', async (req, res) => {
    const nongsaroOptions = nongsaro.options;
    let contentNo = '';

    let response;
    let plantName = req.query.species;
    try{
        response = await axios.get('http://api.nongsaro.go.kr/service/garden/gardenList?apiKey=201810240OZ0QZRO82I7A3HJEUJXTQ&sType=sPlntzrNm&sText=' + plantName)
    } catch(error){
        res.send(error);
        return;
    }

    var body = response.data;

    if (parser.validate(body) === true) { //optional (it'll return an object in case it's not valid)
        var jsonObj = parser.parse(body, nongsaroOptions);
    }

    // Intermediate obj
    var tObj = parser.getTraversalObj(body, nongsaroOptions);
    var jsonObj = parser.convertToJson(tObj, nongsaroOptions);

    if (Array.isArray(jsonObj["response"]["body"]["items"].item)) {
        contentNo += jsonObj["response"]["body"]["items"]["item"][0]["cntntsNo"];
    } else {
        contentNo += jsonObj["response"]["body"]["items"]["item"]["cntntsNo"];
    }

    try{
        response = await axios.get('http://api.nongsaro.go.kr/service/garden/gardenDtl?apiKey=201810240OZ0QZRO82I7A3HJEUJXTQ&sType=sCntntsSj&wordType=cntntsSj&cntntsNo=' + contentNo)
    } catch(error){
        res.json(error);
        return;
    }

    var body = response.data;

    if (parser.validate(body) === true) { //optional (it'll return an object in case it's not valid)
        var jsonObj = parser.parse(body, nongsaroOptions);
    }

    // Parse obj
    var tObj = parser.getTraversalObj(body, nongsaroOptions);
    var jsonObj = parser.convertToJson(tObj, nongsaroOptions);

    // Make JSON format

    let temp = jsonObj["response"]["body"]["item"]["grwhTpCodeNm"];
    temp = temp.split('~');
    temp = JSON.parse('{"min":' + temp[0] + ', "max":' + temp[1].split("℃")[0] + "}");

    let humidity = jsonObj["response"]["body"]["item"]["hdCodeNm"];
    humidity = humidity.split(' ~ ');
    humidity = JSON.parse('{"min":' + humidity[0] + ', "max":' + humidity[1].split("%")[0] + "}");

    let illuminance = jsonObj["response"]["body"]["item"]["lighttdemanddoCodeNm"];
    illuminance = illuminance.split("),");
    let tmp = [];
    for (let i = 0; i < illuminance.length; i++) {
        tmp.push(illuminance[i].split("(")[1].split(" Lux")[0]);
    }
    illuminance = { min: tmp[0].split("~")[0], max: tmp[tmp.length - 1].split("~")[1].replace(',', '') };

    let measurement = new Measurement(temp, humidity, illuminance);
    res.json(measurement);
})

module.exports = router;