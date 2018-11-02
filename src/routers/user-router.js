var express = require('express');
var router = express.Router();
const databaseService = require('../database-service');
let DTO = require('../dto');
let http = require('http');
let parser = require('fast-xml-parser');
let he = require('he');
let axios = require('axios');
let Measurement = require('../measurement');

router.use(function (req, res, next) {
    console.log('Request for user resource arrived...');
    next();
})

router.get('/:userEmail/plants', function (req, res) {
    databaseService.getPlantsOfUser(req.params.userEmail)
    .then((result) => res.json(result))
    .catch((error) => res.json(error))
})

router.post('/validation',(req, res)=>{
    databaseService.isValidCredentials(req.body.email, req.body.password)
    .then((result)=>res.json(result))
    .catch((error)=> res.json(new DTO(false, error.message)));
})

router.post('/', function (req, res) {
    databaseService.createUser(req.body.email, req.body.password)
    .then((result) => res.json(result))
    .catch( (error) => res.json(new DTO(false, error.message)))
})

router.post('/register_kakao', function (req, res) {
    let email = req.body.petplantID;
    let kakao = req.body.kakaoID;

    databaseService.registerKakaotalkId(email, kakao)
    .then(()=> res.render('success'))
    .catch((error)=> res.json(error));
})

router.post('/plants', function (req, res) {
    let plantId = req.body.plantId;
    let userEmail = req.body.userEmail;
    let species = req.body.species;
    let nickname = req.body.nickname;

    databaseService.registerPlant(plantId, userEmail, species, nickname)
    .then((result)=> res.json(result))
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
    .then((result)=> res.json(result))
    .catch((error) => res.json(error))
})

router.get('/plants/selection/:userEmail', function (req, res) {
    let email = req.params.userEmail;
    console.log(email);
    databaseService.getSelectedPlantOfUser(email)
    .then((result)=> res.json(result))
    .catch((error) => res.json(error))
})

router.get('/plants/logs/:userEmail', (req, res)=>{
    let email = req.params.userEmail;
    console.log(email);
    databaseService.getMostRecentLogOfSelectedPlant(email)
    .then((result)=> res.json(result))
    .catch((error) => res.json(error))  
})

router.post('/registration', (req, res)=>{
    let kakaotalkId = req.body.kakaotalkId;
    databaseService.kakaotalkKeyExistsInDatabase(kakaotalkId)
    .then((exists)=>console.log(exists))
    .catch((error)=> res.json(error));
})

router.get('/testtest/:username', (req, res)=>{
    let email = req.params.username;
    databaseService.getSelectedPlantOfKakaotalkUser(email)
    .then((exists)=>{
        console.log(exists);
        res.send(exists);
    })
    .catch((error)=> res.json(error));
})

router.get('/public/nongsaro/', async (req, res)=>{
    let plantName = req.query.species;
    let contentNo = '';
    console.log(plantName);
    var options = {
        attributeNamePrefix : "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName : "#text",
        ignoreAttributes : true,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : false,
        trimValues: false,
        cdataTagName: false, //default is 'false'
        cdataPositionChar: "!",
        localeRange: "", //To support non english character in tag/attribute values.
        parseTrueNumberOnly: false,
        attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
        tagValueProcessor : a => he.decode(a) //default is a=>a
    };

    await axios.get('http://api.nongsaro.go.kr/service/garden/gardenList?apiKey=201810240OZ0QZRO82I7A3HJEUJXTQ&sType=sPlntzrNm&sText=' + plantName)
    .then(response => {
        var body = response.data;
        
        if( parser.validate(body) === true) { //optional (it'll return an object in case it's not valid)
            var jsonObj = parser.parse(body,options);
        }
        
        // Intermediate obj
        var tObj = parser.getTraversalObj(body,options);
        var jsonObj = parser.convertToJson(tObj,options);
        console.log(jsonObj);
        console.log(Array.isArray(jsonObj["response"]["body"]["items"].item));
// 
        // let contentNo;
        if(Array.isArray(jsonObj["response"]["body"]["items"].item)){
            contentNo += jsonObj["response"]["body"]["items"]["item"][0]["cntntsNo"];
        } else{
            contentNo += jsonObj["response"]["body"]["items"]["item"]["cntntsNo"];
        }

        // console.log(jsonObj["response"]["body"]["items"].item);

        // let contentNo = '';
        // contentNo += jsonObj["response"]["body"]["items"]["item"][0]["cntntsNo"];
        console.log(contentNo); 
    })
    .catch(error => {
        console.log(error);
    })

    await axios.get('http://api.nongsaro.go.kr/service/garden/gardenDtl?apiKey=201810240OZ0QZRO82I7A3HJEUJXTQ&sType=sCntntsSj&wordType=cntntsSj&cntntsNo=' + contentNo)
    .then(response => {
        var body = response.data;
        
        if( parser.validate(body) === true) { //optional (it'll return an object in case it's not valid)
            var jsonObj = parser.parse(body,options);
        }
        
        // parsing obj
        var tObj = parser.getTraversalObj(body,options);
        var jsonObj = parser.convertToJson(tObj,options);
        let temp = jsonObj["response"]["body"]["item"]["grwhTpCodeNm"];
        let humidity = jsonObj["response"]["body"]["item"]["hdCodeNm"];
        let illuminance = jsonObj["response"]["body"]["item"]["lighttdemanddoCodeNm"];

        // Make JSON format

        temp = temp.split('~');
        temp = '{"min":' + temp[0] + ', "max":' + temp[1].split("℃")[0] + "}";
        temp = JSON.parse(temp);

        humidity = humidity.split(' ~ ');
        humidity = '{"min":' + humidity[0] + ', "max":' + humidity[1].split("%")[0] + "}";
        humidity = JSON.parse(humidity);

        illuminance = illuminance.split("),")
        console.log(illuminance);
        let tmp = [];
        for(let i = 0; i<illuminance.length; i++){
            tmp.push(illuminance[i].split("(")[1].split(" Lux")[0]);
        }
        console.log(tmp);
        illuminance = '{"types":[';
        console.log(tmp[0].split("~")[0] + " " + tmp[tmp.length-1].split("~")[1].replace(',',''));
        for(let i = 0; i<tmp.length - 1; i++){
            illuminance += '{"min":' + tmp[i].split("~")[0].replace(',', '') + ', "max":' + tmp[i].split("~")[1].replace(',', '') + "}, ";
        }
        console.log(illuminance);
        illuminance += '{"min":' + tmp.slice(-1)[0].split("~")[0].replace(',', '') + ', "max":' + tmp.slice(-1)[0].split("~")[1].replace(',', '') + "}]}";
        console.log(illuminance);
        illuminance = JSON.parse(illuminance);

        console.log(temp);
        console.log(humidity);
        console.log(illuminance);
        let measurement = new Measurement(temp,humidity,illuminance);    
        res.json(measurement);  
    })
    .catch(error => {
        console.log(error);
        res.json(error);
    })
})

module.exports = router;