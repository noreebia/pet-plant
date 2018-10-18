var express = require('express');
var router = express.Router();
const databaseService = require('../database-service');
let DTO = require('../dto');

router.use(function (req, res, next) {
    console.log('Request for user resource arrived...');
    next();
})

router.get('/:userEmail', function (req, res) {
    databaseService.getUserByEmail(req.params.userEmail)
    .then((result) => res.json(new DTO(true, result)))
    .catch((error) => res.json(new DTO(false, error.message)))
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
    .then( (result)=> {
        res.render('success');
    } )
})

module.exports = router;