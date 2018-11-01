var express = require('express');
var router = express.Router();
const databaseService = require('../database-service');
let DTO = require('../dto');
var xml2js = require('xml2js');
var request = require('request');

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

router.get('/test/nongsaro', (req, res)=>{
    try {
        let url = 'http://api.nongsaro.go.kr/service/garden/gardenList?apiKey=201810240OZ0QZRO82I7A3HJEUJXTQ&sType=sCntntsSj&sText=산세베리아'; 
        let parser = new xml2js.Parser();
    
        request(url, function(error, response, body) {
            parser.parseString(body, function(err,result){        
                console.log(result);
            });
        });
    }
    catch (ex) {console.log(ex)}

    res.send(result);
})

module.exports = router;