var dgram = require('dgram');
var server = dgram.createSocket('udp4');

var PORT = 8080;
var HOST = '0.0.0.0';

server.bind(PORT, HOST);

server.on('listening', () => {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', (message, remote) => {
    console.log(remote.address + ':' + remote.port +' - ' + message);
});

