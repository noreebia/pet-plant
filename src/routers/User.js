var express = require('express');
var router = express.Router();
const databaseService = require('../DatabaseService');
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

router.post('/', function (req, res) {
    databaseService.saveUser(req.body.email, req.body.password)
    .then(() => res.json(new DTO(true)))
    .catch( (error) => res.json(new DTO(false, error.message)))
})

module.exports = router;