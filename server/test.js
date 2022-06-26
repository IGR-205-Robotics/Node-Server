const { Marvelmind } = require('./marvelmind');
const http = require('http');
const dgram = require('dgram');
const { send } = require('process');
const socket_udp = dgram.createSocket('udp4');
const fetch = require('node-fetch');

// let server_host = "0.0.0.0";//"192.168.0.100";
// let server_port = 80;
let socket_host = "192.168.0.1";
let socket_port = 23;

// const server = http.createServer(function (req, res) {
//     if(req.url == "/quit") {
//         res.writeHead(200,  {'Content-Type':'text/html'});
//         res.end('<h1>...quitting</h1>');
//         console.log('i show quit');
//     } else {
//         res.writeHead(200,  {'Content-Type':'text/html'});
//         res.end('<h1>Hello World!</h1>');
//         console.log('i welcome');
//     }
// });
// server.listen(server_port, server_host, () => {
//     console.log(`Server is running on http://${server_host}:${server_port}`);
// });

global.g_command = "";
global.g_address = 0;
global.g_coords = [0, 0];

const marvelmind = new Marvelmind({ debug: false, paused: true });
marvelmind.toggleReading();

marvelmind.on('hedgehogMilimeter', (hedgehogAddress, hedgehogCoordinates) => {
    console.log('hedgehogMilimeter', hedgehogAddress, hedgehogCoordinates);
    setUpdatedCoords(hedgehogAddress, [hedgehogCoordinates.x, hedgehogCoordinates.y]);
});

// marvelmind.on('rawDistances', (hedgehogAddress, beaconsDistances) => {
//   console.log('rawDistances', hedgehogAddress, beaconsDistances);
// });

// marvelmind.on('beaconsMilimeter', (beaconsCoordinates) => {
//   console.log('beaconsMilimeter', beaconsCoordinates);
// });
// marvelmind.on('quality', (hedgehogAddress, qualityData) => {
//   console.log('quality', hedgehogAddress, qualityData);
// });
// marvelmind.on('telemetry', (deviceAddress, telemetryData) => {
//   console.log('telemetry', deviceAddress, telemetryData);
// });


socket_udp.bind(5500);

socket_udp.on('error', (err) => {
    console.log(`socket_udp error:\n${err.stack}`);
    socket_udp.close();
});

socket_udp.on('message', (msg, senderInfo) => {
    console.log('Messages received '+ msg)
    if (msg == "UPDATE") {
        data = getUpdatedCoords();
        socket_udp.send(JSON.stringify(data),senderInfo.port,senderInfo.address,function(error){
            if(error){
            client.close();
            }else{
            // console.log('positions sent');
        }
        });
    } else if (msg == "esp") {
        //     process.exit(0);
    } else {
        g_command = msg;
        sendESPMessage(msg).then(data => {
            console.log(data);
        });
        //send to unity
        socket_udp.send("saved command :" + msg,senderInfo.port,senderInfo.address,function(error){
            if(error){
              client.close();
            }else{
                console.log(`Message sent to ${senderInfo.address}:${senderInfo.port}`);
            }
        });
        //send to access point
        socket_udp.send(msg,socket_port,socket_host,function(error){
            if(error){
                client.close();
            }else{
                console.log(`Message sent to ${senderInfo.address}:${senderInfo.port}`);
            }
        });
    }
});

socket_udp.on('listening', () => {
    const address = socket_udp.address();
    console.log(`socket_udp listening on ${address.address}:${address.port}`);
});

function getUpdatedCoords() {
    return {address: g_address, coords: g_coords};
}

function setUpdatedCoords(id, coords) {
    g_address = id;
    g_coords = coords;
}

async function sendESPMessage(comm) {
    const response = await fetch(`http://192.168.0.105:80/message?command=${comm}`);
    const data = await response.text();
    console.log('send message to esp');
    return data;
}