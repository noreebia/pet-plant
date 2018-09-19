const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.send("I'm healthy!");
})

app.post('/logs', function(req, res) {
    let log = req.body;
    console.log(log);
    res.send("Saving log to database...");
})

var server = app.listen(8080, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Express app listening at http://%s:%s", host, port)
})