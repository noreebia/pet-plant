require('dotenv').config();
const express = require('express'),
    bodyParser = require('body-parser'),
    databaseService = require('./databaseService'),
    userRouter = require('./routers/user'),
    logRouter = require('./routers/log'),
    swaggerUi = require('swagger-ui-express'),
    swaggerSpec = require('./swaggerSpec');

const app = express();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec.swaggerSpec)); //swagger

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