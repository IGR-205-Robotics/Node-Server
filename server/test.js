const { Marvelmind } = require('./marvelmind');
const dgram = require('dgram');
const { send } = require('process');
const server = dgram.createSocket('udp4');

global.g_address = 4;
global.g_coords = [1, 1];

const marvelmind = new Marvelmind({ debug: false, paused: true });
marvelmind.toggleReading();

// marvelmind.on('rawDistances', (hedgehogAddress, beaconsDistances) => {
//   console.log('rawDistances', hedgehogAddress, beaconsDistances);
// });

marvelmind.on('hedgehogMilimeter', (hedgehogAddress, hedgehogCoordinates) => {
    // console.log('hedgehogMilimeter', hedgehogAddress, hedgehogCoordinates);
    setUpdatedCoords(hedgehogAddress, [hedgehogCoordinates.x, hedgehogCoordinates.y]);
});

// marvelmind.on('beaconsMilimeter', (beaconsCoordinates) => {
//   console.log('beaconsMilimeter', beaconsCoordinates);
// });
// marvelmind.on('quality', (hedgehogAddress, qualityData) => {
//   console.log('quality', hedgehogAddress, qualityData);
// });
// marvelmind.on('telemetry', (deviceAddress, telemetryData) => {
//   console.log('telemetry', deviceAddress, telemetryData);
// });

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on('message', (msg, senderInfo) => {
    console.log('Messages received '+ msg)
    if (msg == "UPDATE") {
        data = getUpdatedCoords();
        server.send(JSON.stringify(data),senderInfo.port,senderInfo.address,function(error){
            if(error){
            client.close();
            }else{
            console.log('positions sent');
        }
        });
    } else if (msg == "QUIT") {
        process.exit(0);
    } else {
        server.send("client msg received :" + msg,senderInfo.port,senderInfo.address,function(error){
            if(error){
              client.close();
            }else{
                console.log(`Message sent to ${senderInfo.address}:${senderInfo.port}`);
            }
        });
    }
});

server.on('listening', () => {
    const address = server.address();
    console.log(`server listening on ${address.address}:${address.port}`);
});

server.bind(5500);

function getUpdatedCoords() {
    return {address: g_address, coords: g_coords};
}

function setUpdatedCoords(id, coords) {
    g_address = id;
    g_coords = coords;
}