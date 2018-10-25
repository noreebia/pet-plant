var dgram = require('dgram');
var server = dgram.createSocket('udp4');
const databaseService = require('./database-service');

var PORT = 8080;
var HOST = '0.0.0.0';

server.bind(PORT, HOST);

server.on('listening', () => {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', (message, remote) => {
    try{
        let messageToStringArray = message.toString().split("::");

        let plantId = messageToStringArray[0];
        let illuminationLevel = messageToStringArray[1];
        let temperatureLevel = messageToStringArray[2];
        let moistureLevel = messageToStringArray[3];
    
        databaseService.saveLog(plantId, illuminationLevel, temperatureLevel, moistureLevel)    
    } catch(err){
        console.log("Received sensor input but format did not match. Received message: " + message);
    }});

