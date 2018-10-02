let express = require('express');
let app = express();
let bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Hello World');
})

app.post('/logs', function(req, res) {
    console.log("Request body: " + req.body);
    let log = req.body;
    res.send("Hello World");
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})