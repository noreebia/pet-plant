require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const databaseService = require('./DatabaseService');
const userRouter = require('./routers/User');
const logRouter = require('./routers/Log');

const app = express();

databaseService.getAllUsers(function(result){
    console.log(result);
});

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// routers
app.use('/users', userRouter);
app.use('/logs', logRouter);

// default route for health check
app.get('/', function (req, res) {
    res.send("I'm healthy!");
})

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Express app listening at http://%s:%s", host, port)
})