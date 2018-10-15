var express = require('express');
var router = express.Router();
const databaseService = require('../DatabaseService');

router.use(function (req, res, next) {
    console.log('Request for user resource arrived...');
    next()
})

router.get('/:userEmail',function(req, res){
    console.log(req.params.userEmail);
    databaseService.getUserByEmail(req.params.userEmail, function(result){
        console.log(result);
    });
})

router.get('/test/:userEmail',function(req, res){
    console.log(req.params.userEmail);
    databaseService.getUserByEmailPromiseTest(req.params.userEmail).then(function(result){
        res.json(result);
    }, function(error){  
        res.json({success: false, message: "Error occurred while querying database"});     
    })
})

router.post('/', function (req, res) {
    let user = req.body;
    let responseDTO = {success: true, message: ""};
    try{
        databaseService.saveUser(user.email, user.password, function (result) {
            console.log(result);
        });    
    } catch(err){
        responseDTO.success = false;
        responseDTO.message = "User creation failed";
    } finally{
        res.json(responseDTO);
    }
})

module.exports = router;