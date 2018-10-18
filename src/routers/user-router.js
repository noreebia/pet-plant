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

router.post('/test', function (req, res) {
    console.log(req.body);
    databaseService.registerKakaotalkId(req.body.petplantID, req.body.kakaoID)
    .then( (result)=> {
       res.json(result); 
    } )
})

module.exports = router;