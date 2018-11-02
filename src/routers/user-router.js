var express = require('express');
var router = express.Router();
const databaseService = require('../database-service');
let DTO = require('../dto');
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
    let deviceId = req.body.plantId;
    let userEmail = req.body.userEmail;
    let species = req.body.species;
    let nickname = req.body.nickname;

    databaseService.registerPlant(deviceId, userEmail, species, nickname)
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
    databaseService.kakaotalkKeyExistsInDatabase(req.body.kakaotalkId)
        .then((exists) => console.log(exists))
        .catch((error) => res.json(error));
})

router.get('/testtest/:username', (req, res) => {
    databaseService.getSelectedPlantOfKakaotalkUser(req.params.username)
        .then((exists) => {
            console.log(exists);
            res.send(exists);
        })
        .catch((error) => res.json(error));
})

router.post('/testtesttest', function (req, res) {
    let nickname = req.body.nickname;
    let email = req.body.email;
    console.log(email);
    databaseService.selectPlant(nickname, email)
        .then((result) => res.json(result))
        .catch((error) => res.json(error))
})

router.get('/public/nongsaro/:plantName', (req, res) => {
    nongsaro.getPlantData(req.params.plantName)
    .then(result => res.json(result))
    .catch((error) => res.json(error))
})

module.exports = router;